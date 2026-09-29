"""Vidéo de présentation Play Store avec voix off (à mettre en ligne sur YouTube) : store/playstore/video_fr.mp4

Usage : python store/make_video.py
Format 1920 x 1080 (16:9), 30 i/s. Voix off synthétisée (edge-tts, voix fr-FR-HenriNeural),
musique du jeu en fond, textes dorés et étincelles dans l'esprit d'une bande-annonce.
Nécessite : pip install edge-tts imageio-ffmpeg pillow  (et une connexion internet pour la voix)
"""
import asyncio
import math
import os
import random
import subprocess

import edge_tts
import imageio_ffmpeg
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STORE = os.path.join(ROOT, 'store')
RAW = os.path.join(STORE, 'raw')
IMG = os.path.join(ROOT, 'image')
TMP = os.path.join(STORE, '.video_tmp')
OUT = os.path.join(STORE, 'playstore', 'video_fr.mp4')
FF = imageio_ffmpeg.get_ffmpeg_exe()
W, H, FPS = 1920, 1080, 30
VOICE, RATE = 'fr-FR-HenriNeural', '-4%'
FONTS = 'C:/Windows/Fonts'
TITLE = ImageFont.truetype(os.path.join(FONTS, 'georgiab.ttf'), 92)
HUGE = ImageFont.truetype(os.path.join(FONTS, 'georgiab.ttf'), 150)
SUB = ImageFont.truetype(os.path.join(FONTS, 'georgiai.ttf'), 48)
LABEL = ImageFont.truetype(os.path.join(FONTS, 'georgiab.ttf'), 70)
GOLD, GOLD_LIGHT = (232, 184, 92), (255, 236, 186)
PAD = 0.45  # silence après chaque phrase (s)
FADE = 0.35


# ---------- Outils d'image ----------
def ease(t):
    t = max(0.0, min(1.0, t))
    return t * t * (3 - 2 * t)


def cover(img, w, h):
    k = max(w / img.width, h / img.height)
    img = img.resize((round(img.width * k), round(img.height * k)), Image.LANCZOS)
    x, y = (img.width - w) // 2, (img.height - h) // 2
    return img.crop((x, y, x + w, y + h))


def vignette():
    m = Image.new('L', (W, H), 0)
    ImageDraw.Draw(m).ellipse((-W * 0.2, -H * 0.3, W * 1.2, H * 1.3), fill=255)
    m = m.filter(ImageFilter.GaussianBlur(220))
    v = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    v.putalpha(Image.eval(m, lambda a: round(210 * (1 - a / 255))))
    return v


VIGNETTE = vignette()


class Sparkles:
    """Étincelles dorées qui montent lentement (même tirage pour toute la vidéo)."""
    def __init__(self, n=70, seed=3):
        r = random.Random(seed)
        self.p = [(r.uniform(0, W), r.uniform(0, H), r.uniform(20, 70), r.uniform(1.5, 4.5), r.uniform(0, 6.28)) for _ in range(n)]

    def draw(self, img, t, strength=1.0):
        layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
        d = ImageDraw.Draw(layer)
        for x, y, speed, size, ph in self.p:
            yy = (y - speed * t) % (H + 40) - 20
            xx = x + math.sin(t * 0.8 + ph) * 18
            a = round(strength * 200 * (0.5 + 0.5 * math.sin(t * 2.5 + ph)))
            d.ellipse((xx - size, yy - size, xx + size, yy + size), fill=GOLD_LIGHT + (a,))
        img.alpha_composite(layer.filter(ImageFilter.GaussianBlur(1.2)))
        img.alpha_composite(layer.filter(ImageFilter.GaussianBlur(6)))


SPARKS = Sparkles()


def gold_text(img, xy, text, font, alpha=1.0, anchor='la'):
    """Texte doré avec halo lumineux (style bande-annonce)."""
    glow = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(glow).text(xy, text, font=font, fill=GOLD + (round(230 * alpha),), anchor=anchor)
    img.alpha_composite(glow.filter(ImageFilter.GaussianBlur(14)))
    d = ImageDraw.Draw(img)
    d.text((xy[0] + 3, xy[1] + 4), text, font=font, fill=(0, 0, 0, round(160 * alpha)), anchor=anchor)
    d.text(xy, text, font=font, fill=GOLD_LIGHT + (round(255 * alpha),), anchor=anchor)


def white_text(img, xy, text, font, alpha=1.0, anchor='la'):
    d = ImageDraw.Draw(img)
    d.text((xy[0] + 2, xy[1] + 3), text, font=font, fill=(0, 0, 0, round(180 * alpha)), anchor=anchor)
    d.text(xy, text, font=font, fill=(255, 255, 255, round(240 * alpha)), anchor=anchor)


def rounded(img, radius):
    m = Image.new('L', img.size, 0)
    ImageDraw.Draw(m).rounded_rectangle((0, 0, img.width - 1, img.height - 1), radius, fill=255)
    return m


def blurred_bg(path, dark=0.45, blur=16):
    bg = cover(Image.open(path).convert('RGB'), W, H).filter(ImageFilter.GaussianBlur(blur))
    return Image.blend(bg, Image.new('RGB', (W, H), (6, 6, 12)), dark).convert('RGBA')


# ---------- Scènes : fonction (t, durée) -> image ----------
def scene_intro(bg_path, logo=True, title='CheckWord', sub='Le défi des mots cachés'):
    bg = blurred_bg(bg_path, 0.5, 10)
    lg = Image.open(os.path.join(IMG, 'logo.webp')).convert('RGBA')

    def f(t, d):
        z = 1.06 - 0.06 * (t / d)
        img = bg.resize((round(W * z), round(H * z))).crop((0, 0, W, H)) if z > 1 else bg.copy()
        img = img.copy()
        img.alpha_composite(VIGNETTE)
        SPARKS.draw(img, t, 1.2)
        k = ease(t / 1.0)
        if logo:
            s = round(240 * (0.85 + 0.15 * k))
            l2 = lg.resize((s, s), Image.LANCZOS)
            img.paste(l2, ((W - s) // 2, 150 + (240 - s) // 2), Image.eval(rounded(l2, s // 2), lambda a: round(a * k)))
        gold_text(img, (W / 2, 560 + (1 - k) * 30), title, HUGE, k, 'mm')
        k2 = ease((t - 0.6) / 0.8)
        white_text(img, (W / 2, 690), sub, SUB, k2, 'mm')
        return img
    return f


def scene_phone(shot, bg_path, titles, side='right'):
    """Capture du jeu dans un cadre arrondi + titres dorés de l'autre côté (ils changent au fil de la voix)."""
    bg = blurred_bg(bg_path, 0.5)
    s = Image.open(os.path.join(RAW, shot)).convert('RGB')
    ph = 980
    pw = round(s.width * ph / s.height)
    s = s.resize((pw, ph), Image.LANCZOS)
    frame = Image.new('RGBA', (pw + 24, ph + 24), (0, 0, 0, 0))
    ImageDraw.Draw(frame).rounded_rectangle((0, 0, pw + 23, ph + 23), 46, fill=(20, 18, 24, 255), outline=GOLD + (255,), width=3)
    frame.paste(s, (12, 12), rounded(s, 36))
    px = W - frame.width - 170 if side == 'right' else 170
    tx = 150 if side == 'right' else px + frame.width + 110
    shadow = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(shadow).rounded_rectangle((px + 16, 64, px + frame.width + 16, 64 + frame.height), 46, fill=(0, 0, 0, 170))
    shadow = shadow.filter(ImageFilter.GaussianBlur(24))

    def f(t, d):
        img = bg.copy()
        img.alpha_composite(VIGNETTE)
        SPARKS.draw(img, t, 0.7)
        k = ease(t / 0.7)
        y = round((H - frame.height) / 2 + (1 - k) * 60)
        img.alpha_composite(shadow, (0, y - 64))
        img.alpha_composite(frame, (px, y))
        # titre courant : chacun apparaît à sa fraction de la scène
        cur = [ti for ti in titles if t >= ti[0] * d]
        if cur:
            start, big, small = cur[-1]
            kk = ease((t - start * d) / 0.6)
            yy = 380
            for line in big.split('\n'):
                gold_text(img, (tx, yy + (1 - kk) * 25), line, TITLE, kk)
                yy += 108
            if small:
                for line in small.split('\n'):
                    white_text(img, (tx + 4, yy + 20), line, SUB, kk)
                    yy += 62
        return img
    return f


def scene_themes(items, heading):
    """Défilement rapide d'images de thèmes en plein écran, avec leur nom."""
    imgs = [cover(Image.open(p).convert('RGB'), round(W * 1.08), round(H * 1.08)).convert('RGBA') for p, _ in items]

    def f(t, d):
        per = d / len(items)
        i = min(len(items) - 1, int(t / per))
        k = (t - i * per) / per
        base = imgs[i]
        x = round((base.width - W) * k)
        img = base.crop((x, 0, x + W, H)).copy()
        if k < 0.18 and i > 0:  # fondu rapide depuis l'image précédente
            prev = imgs[i - 1].crop((base.width - W, 0, base.width, H))
            img = Image.blend(prev, img, ease(k / 0.18))
        img.alpha_composite(VIGNETTE)
        SPARKS.draw(img, t, 0.8)
        gold_text(img, (W / 2, 110), heading, LABEL, 1, 'mm')
        white_text(img, (W / 2, H - 120), items[i][1], LABEL, 1, 'mm')
        return img
    return f


# ---------- Voix off ----------
async def tts(text, path):
    await edge_tts.Communicate(text, VOICE, rate=RATE).save(path)


def duration(path):
    out = subprocess.run([FF, '-i', path], capture_output=True, text=True).stderr
    h, m, s = out.split('Duration: ')[1].split(',')[0].split(':')
    return int(h) * 3600 + int(m) * 60 + float(s)


def build():
    os.makedirs(TMP, exist_ok=True)
    th = lambda n: os.path.join(IMG, f'plan{n}.webp')
    names = ['Fantasy', 'Sakura', 'Cyberpunk', 'Candy', 'Océan', 'Crépuscule', 'Labo', 'Rue',
             'Échecs', 'Hiver', 'Forêt', 'Étoiles', 'Noël', 'Foot', 'Savane', 'Halloween']

    # (texte de la voix, scène)
    script = [
        ("Et si chaque mot devenait une aventure ? Découvrez CheckWord, le défi des mots cachés.",
         scene_intro(th(1))),
        ("Un indice. Des cases vides. À toi de trouver le mot, lettre après lettre, avant de perdre toutes tes vies.",
         scene_phone('solo.png', th(2), [(0, 'Un indice.\nUn mot caché.', 'À toi de le deviner,\nlettre après lettre.')])),
        ("Plus de cinq mille mots par langue, et quatre niveaux de difficulté, du plus facile au plus redoutable.",
         scene_phone('german.png', th(1), [(0, 'Plus de 5 000 mots', 'par langue'), (0.45, '4 niveaux\nde difficulté', 'du facile au très difficile')], 'left')),
        ("Bloqué ? Utilise tes jokers : révèle une lettre, gagne une vie, ou découvre le mot entier.",
         scene_phone('victory.png', th(2), [(0, 'Des jokers', 'une lettre, une vie\nou le mot entier')])),
        ("En mode Survie, chaque seconde compte : trente secondes de plus par mot trouvé, cinq de moins à chaque erreur.",
         scene_phone('survival.png', th(3), [(0, 'Mode Survie', 'chaque seconde compte'), (0.5, '+30 s', 'par mot trouvé\n−5 s par erreur')], 'left')),
        ("Bats ton record, et entre dans ton top dix des meilleures parties.",
         scene_phone('record.png', th(3), [(0, 'Bats ton record', 'ton top 10 des meilleures parties')])),
        ("Défie tes amis en multijoueur, de deux à six joueurs sur le même téléphone. À chaque manche, un nouveau maître choisit le mot secret.",
         scene_phone('multi.png', th(4), [(0, 'Multijoueur', 'de 2 à 6 joueurs\nsur le même téléphone'), (0.55, 'Un nouveau maître', 'à chaque manche')], 'left')),
        ("Personnalise ton aventure avec seize univers à débloquer.",
         scene_phone('themes.png', th(5), [(0, '16 univers', 'à débloquer')])),
        ("Huit se gagnent en progressant dans le mode Solo, et huit autres récompensent tes meilleurs temps de survie.",
         scene_themes([(th(n), names[n - 1]) for n in range(1, 17)], '16 univers à débloquer')),
        ("Joue en français, en anglais, en espagnol ou en allemand, avec un clavier adapté à chaque langue.",
         scene_phone('settings.png', th(10), [(0, '4 langues', 'français · anglais\nespagnol · allemand'), (0.5, 'Un clavier', 'pour chaque langue')])),
        ("CheckWord. Réfléchis. Joue. Progresse. Gratuit sur Google Play.",
         scene_intro(th(12), True, 'CheckWord', 'Réfléchis. Joue. Progresse. · Gratuit sur Google Play')),
    ]

    # 1. Voix : un fichier par phrase, puis assemblage avec silences
    durations, clips = [], []
    for i, (text, _) in enumerate(script):
        path = os.path.join(TMP, f'v{i:02d}.mp3')
        asyncio.run(tts(text, path))
        dur = duration(path)
        durations.append(dur + PAD + (0.6 if i == 0 else 0))
        clips.append(path)
        print(f'voix {i}: {dur:.1f} s')
    starts = [sum(durations[:i]) for i in range(len(durations))]
    total = sum(durations) + 1.0

    voice = os.path.join(TMP, 'voice.m4a')
    inputs, delays = [], []
    for i, c in enumerate(clips):
        inputs += ['-i', c]
        delays.append(f'[{i}:a]adelay={round((starts[i] + (0.6 if i == 0 else 0)) * 1000)}|{round((starts[i] + (0.6 if i == 0 else 0)) * 1000)}[a{i}]')
    mix = ';'.join(delays) + ';' + ''.join(f'[a{i}]' for i in range(len(clips))) + f'amix=inputs={len(clips)}:normalize=0[v]'
    subprocess.run([FF, '-y', '-loglevel', 'error', *inputs, '-filter_complex', mix, '-map', '[v]', '-c:a', 'aac', voice], check=True)
    print(f'durée totale : {total:.1f} s')

    # 2. Images + mixage voix (fort) et musique (douce)
    music = os.path.join(ROOT, 'sound', 'sound1.mp3')
    cmd = [FF, '-y', '-loglevel', 'error',
           '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
           '-i', voice, '-i', music,
           '-filter_complex',
           f'[1:a]aresample=44100,aformat=channel_layouts=stereo,volume=1.6[vo];[2:a]atrim=0:{total:.2f},volume=0.16,afade=t=in:d=1.5,afade=t=out:st={total - 2.5:.2f}:d=2.5[mu];'
           f'[vo][mu]amix=inputs=2:normalize=0:duration=longest[a]',
           '-map', '0:v', '-map', '[a]', '-t', f'{total:.2f}',
           '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p',
           '-c:a', 'aac', '-b:a', '192k', '-ar', '44100', '-ac', '2', '-movflags', '+faststart', OUT]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    n = round(total * FPS)
    for i in range(n):
        t = i / FPS
        k = max(j for j, s in enumerate(starts) if s <= t)
        d = durations[k] + (1.0 if k == len(script) - 1 else 0)
        img = script[k][1](t - starts[k], d)
        if k > 0 and t - starts[k] < FADE:
            prev = script[k - 1][1](t - starts[k - 1], durations[k - 1])
            img = Image.blend(prev, img, ease((t - starts[k]) / FADE))
        if t > total - 1.0:  # fondu au noir final
            img = Image.blend(img, Image.new('RGBA', (W, H), (0, 0, 0, 255)), ease(t - (total - 1.0)))
        proc.stdin.write(img.convert('RGB').tobytes())
        if i % 300 == 0:
            print(f'  image {i}/{n}')
    proc.stdin.close()
    proc.wait()
    for fn in os.listdir(TMP):
        os.remove(os.path.join(TMP, fn))
    os.rmdir(TMP)
    print('écrit :', OUT, os.path.getsize(OUT) // 1024, 'Ko')


if __name__ == '__main__':
    build()

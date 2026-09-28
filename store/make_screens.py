"""Génère les visuels Play Store : captures de l'app en plein écran avec un message écrit par-dessus.

Usage : python store/make_screens.py
Les captures brutes (1080 x 2400) sont lues dans store/raw/, les visuels finaux écrits dans
store/playstore/<langue>/. Format de sortie : 1080 x 1920 (9:16), le format recommandé par Google Play.
"""
import os
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.dirname(os.path.abspath(__file__))
RAW = os.path.join(ROOT, 'raw')
OUT = os.path.join(ROOT, 'playstore')
FONTS = 'C:/Windows/Fonts'

W, H = 1080, 1920
TITLE_FONT = ImageFont.truetype(os.path.join(FONTS, 'seguibl.ttf'), 88)   # Segoe UI Black
SUB_FONT = ImageFont.truetype(os.path.join(FONTS, 'seguisb.ttf'), 44)     # Segoe UI Semibold
PAD = 90      # marge autour du texte dans le bandeau
FADE_H = 200  # hauteur du fondu entre le bandeau et l'app


def hex_rgb(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def wrap(text, font, max_w, draw):
    """Coupe le texte en lignes qui tiennent dans max_w (les « \\n » forcent un retour)."""
    lines = []
    for para in text.split('\n'):
        cur = ''
        for word in para.split(' '):
            test = (cur + ' ' + word).strip()
            if draw.textlength(test, font=font) <= max_w:
                cur = test
            else:
                lines.append(cur)
                cur = word
        lines.append(cur)
    return lines


def veil(color, at_top, band_h):
    """Bandeau de la couleur du thème : plein derrière le texte, puis fondu vers l'app."""
    layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    px = layer.load()
    rgb = hex_rgb(color)
    for i in range(band_h + FADE_H):
        a = 250 if i < band_h else round(250 * (1 - (i - band_h) / FADE_H) ** 1.4)
        y = i if at_top else H - 1 - i
        for x in range(W):
            px[x, y] = rgb + (a,)
    return layer


def layout(draw, title, sub):
    t_lines = wrap(title, TITLE_FONT, W - 120, draw)
    s_lines = wrap(sub, SUB_FONT, W - 140, draw) if sub else []
    block_h = len(t_lines) * 100 + (18 + len(s_lines) * 58 if s_lines else 0)
    return t_lines, s_lines, block_h


def text_block(draw, t_lines, s_lines, y, accent):
    for line in t_lines:
        tw = draw.textlength(line, font=TITLE_FONT)
        x = (W - tw) / 2
        draw.text((x + 2, y + 4), line, font=TITLE_FONT, fill=(0, 0, 0, 140))  # ombre légère
        draw.text((x, y), line, font=TITLE_FONT, fill=(255, 255, 255, 255))
        y += 100
    y += 18
    for line in s_lines:
        tw = draw.textlength(line, font=SUB_FONT)
        draw.text(((W - tw) / 2, y), line, font=SUB_FONT, fill=hex_rgb(accent) + (255,))
        y += 58


def make(spec, lang):
    shot = Image.open(os.path.join(RAW, spec['shot'])).convert('RGBA')
    shot = shot.resize((W, round(shot.height * W / shot.width)), Image.LANCZOS)
    top = min(spec.get('crop_top', 0), shot.height - H)
    img = shot.crop((0, top, W, top + H))

    at_top = spec.get('text', 'top') == 'top'
    dark, accent = spec['colors']
    title, sub = spec['texts'][lang]
    draw = ImageDraw.Draw(img)
    t_lines, s_lines, block_h = layout(draw, title, sub)
    band_h = block_h + PAD * 2
    img.alpha_composite(veil(dark, at_top, band_h))
    y = PAD if at_top else H - band_h + PAD
    text_block(ImageDraw.Draw(img), t_lines, s_lines, y, accent)

    out_dir = os.path.join(OUT, lang)
    os.makedirs(out_dir, exist_ok=True)
    path = os.path.join(out_dir, spec['name'] + '.png')
    img.convert('RGB').save(path, optimize=True)
    return path


# Un visuel par fonctionnalité : capture, zone gardée, position du texte, couleurs (voile, accent), textes.
# crop_top : pixels (après mise à l'échelle à 1080 de large) retirés en haut de la capture.
SCREENS = [
    {'name': '01_accueil', 'shot': 'home.png', 'crop_top': 555, 'text': 'top',
     'colors': ('#0d1520', '#f0c060'),
     'texts': {'fr': ('Devine le mot caché', 'Un indice, des cases vides… à toi de jouer')}},
    {'name': '02_solo', 'shot': 'solo.png', 'crop_top': 0, 'text': 'bottom',
     'colors': ('#2a1625', '#ffb3c6'),
     'texts': {'fr': ('Des indices qui font réfléchir', 'Plus de 5 000 mots · 4 niveaux de difficulté')}},
    {'name': '03_victoire', 'shot': 'victory.png', 'crop_top': 555, 'text': 'bottom',
     'colors': ('#2a1625', '#ffb3c6'),
     'texts': {'fr': ('Monte de niveau', 'Chaque mot trouvé rapporte des pièces pour tes jokers')}},
    {'name': '04_survie', 'shot': 'survival.png', 'crop_top': 0, 'text': 'bottom',
     'colors': ('#050510', '#00f3ff'),
     'texts': {'fr': ('Mode Survie : bats le chrono', '+30 s par mot trouvé · −5 s par erreur')}},
    {'name': '05_record', 'shot': 'record.png', 'crop_top': 555, 'text': 'bottom',
     'colors': ('#050510', '#00f3ff'),
     'texts': {'fr': ('Bats ton record', 'Tes 10 meilleures parties au classement')}},
    {'name': '06_multijoueur', 'shot': 'multi.png', 'crop_top': 555, 'text': 'bottom',
     'colors': ('#4a1d33', '#ff9ec0'),
     'texts': {'fr': ('Défie tes amis', 'De 2 à 6 joueurs sur le même téléphone')}},
    {'name': '07_themes', 'shot': 'themes.png', 'crop_top': 180, 'text': 'top',
     'colors': ('#061539', '#7fd8ff'),
     'texts': {'fr': ('8 univers à débloquer', 'Un nouveau thème tous les 50 niveaux')}},
    {'name': '08_langues', 'shot': 'settings.png', 'crop_top': 240, 'text': 'top',
     'colors': ('#061539', '#7fd8ff'),
     'texts': {'fr': ('Joue en 4 langues', 'Français · English · Español · Deutsch')}},
    {'name': '09_clavier', 'shot': 'german.png', 'crop_top': 0, 'text': 'bottom',
     'colors': ('#0d1520', '#f0c060'),
     'texts': {'fr': ('Un clavier pour chaque langue', 'Ñ en espagnol, Ä Ö Ü en allemand')}},
    {'name': '10_comment_jouer', 'shot': 'howto.png', 'crop_top': 330, 'text': 'top',
     'colors': ('#0d1520', '#f0c060'),
     'texts': {'fr': ('Des règles claires', 'Un guide complet pour chaque mode de jeu')}},
]

if __name__ == '__main__':
    import sys
    only = sys.argv[1:]
    for spec in SCREENS:
        if only and spec['name'] not in only:
            continue
        for lang in spec['texts']:
            if os.path.exists(os.path.join(RAW, spec['shot'])):
                print(make(spec, lang))
            else:
                print('capture manquante :', spec['shot'])

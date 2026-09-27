import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import Icon, { IconText } from './../../components/Icon';
import Ornaments from './../../components/Ornaments';
import ThemeBackdrop from './../../components/ThemeBackdrop';
import { useGameTheme } from './../../contexts/GameThemeContext';
import { ThemePalette, withAlpha } from './../../themes/decor';

// Le contenu du mode d'emploi vit dans les traductions (clé `aide_modes`) :
// une liste de modes, chacun découpé en sections. Une section contient au choix
// un paragraphe (`texte`), une liste numérotée (`etapes`) et/ou une liste à puces (`points`).
// Un élément de liste est soit une chaîne, soit { texte, icone?, sous? } pour ajouter
// une icône Font Awesome ou des sous-points.
type Item = string | { texte: string; icone?: string; sous?: Item[] };

interface Section {
    titre: string;
    texte?: string;
    etapes?: Item[];
    points?: Item[];
    note?: string;
}

interface Mode {
    id: string;
    titre: string;
    sections: Section[];
}

// Icône et couleur (prise dans la palette du thème) de chaque mode
const MODE_STYLE: Record<string, { icon: string; color: keyof ThemePalette }> = {
    solo: { icon: 'chess-knight', color: 'primary' },
    multi: { icon: 'crown', color: 'accent' },
    survie: { icon: 'stopwatch', color: 'success' },
};

export default function HowToPlay() {
    const router = useRouter();
    const { t } = useTranslation();
    const { decor } = useGameTheme();
    const pal = decor.palette;
    const styles = useMemo(() => makeStyles(pal), [pal]);
    const [activeMode, setActiveMode] = useState(0);

    const modes = t('aide_modes', { returnObjects: true }) as Mode[];
    const mode = Array.isArray(modes) ? modes[activeMode] : undefined;
    const color = pal[(MODE_STYLE[mode?.id ?? 'solo'] ?? MODE_STYLE.solo).color];

    const renderItem = (item: Item, key: number, prefix: React.ReactNode, depth = 0) => {
        const texte = typeof item === 'string' ? item : item.texte;
        const icone = typeof item === 'string' ? undefined : item.icone;
        const sous = typeof item === 'string' ? undefined : item.sous;
        return (
            <View key={key}>
                <View style={[styles.item, depth > 0 && styles.subItem]}>
                    <View style={styles.prefix}>{icone ? <Icon name={icone} size={13} color={color} /> : prefix}</View>
                    <Text style={styles.itemText}>{texte}</Text>
                </View>
                {sous?.map((s, i) =>
                    renderItem(s, i, <Icon name="angle-right" size={11} color={color} />, depth + 1)
                )}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.wrap}>
            <ThemeBackdrop />

            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <IconText icon="arrow-left" textStyle={styles.backText} style={{ justifyContent: 'flex-start' }}>
                        {t('retour')}
                    </IconText>
                </TouchableOpacity>
                <IconText icon="circle-info" textStyle={styles.headerTitle}>{t('aide_titre')}</IconText>
                <View style={{ width: 80 }} />
            </View>

            {/* Onglets : un mode à la fois */}
            <View style={styles.tabs}>
                {Array.isArray(modes) && modes.map((m, i) => {
                    const ms = MODE_STYLE[m.id] ?? MODE_STYLE.solo;
                    const s = { icon: ms.icon, color: pal[ms.color] };
                    const active = i === activeMode;
                    return (
                        <Pressable
                            key={m.id}
                            style={[styles.tab, active && { borderColor: s.color, backgroundColor: `${s.color}22` }]}
                            onPress={() => setActiveMode(i)}
                        >
                            <Icon name={s.icon} size={16} color={active ? s.color : pal.textMuted} />
                            <Text style={[styles.tabText, active && { color: s.color }]} numberOfLines={1}>
                                {m.titre}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>

            <ScrollView contentContainerStyle={styles.scroll}>
                {mode?.sections.map((section, si) => (
                    <View key={si} style={[styles.card, { borderLeftColor: color }]}>
                        <Text style={[styles.cardTitle, { color }]}>{section.titre}</Text>
                        {section.texte && <Text style={styles.paragraph}>{section.texte}</Text>}
                        {section.etapes?.map((item, i) =>
                            renderItem(item, i, <Text style={[styles.stepNum, { color }]}>{i + 1}.</Text>)
                        )}
                        {section.points?.map((item, i) =>
                            renderItem(item, i, <Icon name="angle-right" size={12} color={color} />)
                        )}
                        {section.note && (
                            <IconText
                                icon="triangle-exclamation"
                                iconColor={color}
                                textStyle={styles.note}
                                style={styles.noteRow}
                            >
                                {section.note}
                            </IconText>
                        )}
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

// Styles calculés à partir de la palette du thème actif
const makeStyles = (p: ThemePalette) => StyleSheet.create({
    wrap: {
        flex: 1,
        backgroundColor: p.bg,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 12,
    },
    backBtn: {
        padding: 8,
        width: 80,
    },
    backText: {
        color: p.text,
        fontSize: 15,
        fontWeight: 'bold',
    },
    headerTitle: {
        color: p.primary,
        fontSize: 18,
        fontWeight: 'bold',
    },
    tabs: {
        flexDirection: 'row',
        gap: 8,
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 10,
        paddingHorizontal: 4,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: p.panelBorder,
        backgroundColor: p.panel,
    },
    tabText: {
        color: p.textMuted,
        fontSize: 12,
        fontWeight: 'bold',
        flexShrink: 1,
    },
    scroll: {
        paddingHorizontal: 16,
        paddingBottom: 30,
        gap: 14,
    },
    card: {
        backgroundColor: p.panel,
        borderRadius: 12,
        borderLeftWidth: 4,
        paddingVertical: 14,
        paddingHorizontal: 16,
    },
    cardTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    paragraph: {
        color: p.text,
        fontSize: 14,
        lineHeight: 21,
        marginBottom: 6,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
        marginBottom: 7,
    },
    subItem: {
        marginLeft: 22,
    },
    prefix: {
        minWidth: 16,
        paddingTop: 3,
        alignItems: 'center',
    },
    stepNum: {
        fontSize: 14,
        fontWeight: 'bold',
        lineHeight: 16,
    },
    itemText: {
        flex: 1,
        color: p.text,
        fontSize: 14,
        lineHeight: 21,
    },
    noteRow: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginTop: 6,
    },
    note: {
        flex: 1,
        color: p.textMuted,
        fontSize: 13,
        fontStyle: 'italic',
        lineHeight: 19,
    },
});

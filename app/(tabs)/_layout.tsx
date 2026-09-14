import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* headerShown: false permet de cacher l'en-tête natif du téléphone, 
          puisque tu as déjà créé tes propres en-têtes dans ton jeu */}
    </Stack>
  );
}
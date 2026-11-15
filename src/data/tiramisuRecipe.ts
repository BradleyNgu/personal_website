/** Shared tiramisu recipe — used by Notepad and the virtual CMD filesystem. */

export const TIRAMISU_FILENAME = 'tiramisu.txt'

export const TIRAMISU_RECIPE = `TIRAMISU
=======
(do not share with recruiters who prefer cake)

INGREDIENTS
-----------
Espresso soak
  - 1 1/2 cups strong espresso, cooled
  - 2 tbsp sugar (optional)
  - 2 tbsp coffee liqueur (optional)

Mascarpone cream
  - 4 large egg yolks
  - 1/2 cup sugar
  - 16 oz (450g) mascarpone, cold
  - 1 1/4 cups heavy cream, cold
  - 1 tsp vanilla extract

Assembly
  - ~24 ladyfingers (savoiardi)
  - Unsweetened cocoa powder, for dusting
  - Dark chocolate shavings (optional)

STEPS
-----
1. Brew espresso and let it cool. Stir in sugar / liqueur if using.
2. Whisk egg yolks + sugar over a double boiler until thick, pale,
   and slightly warm (ribbon stage), ~5 minutes. Cool 2–3 minutes.
3. Beat in mascarpone until smooth (don't overmix).
4. Whip cream + vanilla to soft-medium peaks. Fold into mascarpone
   mixture in 2 additions until fluffy.
5. Quickly dip each ladyfinger in espresso (1–2 seconds — don't soak
   into mush). Line the bottom of an 8x8" or similar dish.
6. Spread half the cream over the ladyfingers.
7. Repeat: dipped ladyfingers, then remaining cream.
8. Cover and chill at least 4 hours (overnight is better).
9. Dust generously with cocoa right before serving.
10. Optional: shower with chocolate shavings. Accept compliments.

NOTES
-----
- Soft peaks > stiff peaks. Overwhipped cream = sad tiramisu.
- If eggs worry you, use pasteurized eggs or a cooked zabaglione.
- Leftovers keep ~2–3 days in the fridge.
- Best enjoyed while debugging CSS.

~ Bradley's secret recipe.txt
`

export const TIRAMISU_RECIPE_LINES = TIRAMISU_RECIPE.split('\n')

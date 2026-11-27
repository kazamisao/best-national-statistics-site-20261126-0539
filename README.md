[![Make the best national statistics site](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![Rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/kazamisao/best-national-statistics-site-20261126-0539/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![Reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/kazamisao/best-national-statistics-site-20261126-0539/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)

# Tanah & Tetangga — Namibia in Numbers

A national statistics site built as an atlas of two maps. One map shows the
land; the other shows the people. Namibia is vast and nearly empty in the south
and crowded in a thin northern strip — and every service, school and job has to
cross that distance. All figures come from the Namibia Statistics Agency's
2023 Population and Housing Census Main Report (3,022,401 people counted on
24 September 2023) and the 2023 PHC Labour Force Report.

## What it holds

- **Two maps, synchronised.** A schematic geographic map coloured by population
  density, and a Dorling cartogram — one circle per region, sized by population.
  Tap a region on either map; both highlight it and the card below reads it.
- **Fourteen regions, ranked**, with a toggle between head counts and shares of
  the country. The five most populous regions hold 54.5% of Namibia.
- **Age & households** — 37% are children, 71.1% under 35, median age 21;
  households shrank to 3.8 people while their number grew 62.7% since 2011.
- **Education** — 91.5% literate at 15+, but 5.2% of town dwellers aged 6+ never
  attended school against 14.4% in rural areas.
- **Water & housing** — safe water reached 91.4% of homes; 40.0% still have no
  toilet and 59.5% have electricity access.
- **Work & economy** — 36.9% unemployed on the strict measure, 54.8% broad,
  44.4% among youth; GDP US$12.35 billion in 2023.
- **Region profiles** for all fourteen regions, **compare any two regions**
  indicator by indicator, and a **sortable full table** with sources and methods.

## Run

```bash
node serve.ts
# open http://localhost:8080
```

## Test

```bash
node --test test/site.test.mjs
```

The tests check that the fourteen regional populations add up to the census
total (3,022,401), that households add up (756,339), that shares, densities
and household sizes agree with the published counts, and that no file names
a network address or carries a placeholder.

## Hand in

```bash
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and writes
`dossier.json` with the kit's vendored library. Screenshots are real renders
of the site's own code; `shots.json` records which view each one shows.

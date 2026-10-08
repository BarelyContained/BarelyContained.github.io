# Project description \- "Predicting Forest Fires" Data Science Uni individual project

---

## Context:

CS165 Data Science Coursework, Spring 2025, individual project

## Tools

Google Colab, Python, Pandas, Seaborn, scikit-learn (Decision Tree, K-means, StandardScaler)

## Task

Individually carry out a full data science pipeline — from framing a research question through to modelling and communicating results — on a self-selected dataset from four options (Forest Fires, Glass Identification, Parkinson's, Wine). Chose the Algerian Forest Fires dataset to investigate which meteorological features are most indicative of fire occurrence, and to build a model to predict fires based on those conditions. 

## Process

**Dataset selection** Chose a 2012 meteorological dataset covering two Algerian regions (recorded during a year with an unusually high number of fires), including temperature, humidity, wind, rainfall, and Canadian Fire Weather Index components (FFMC, DMC, DC, ISI, BUI, FWI).

**Exploratory data analysis** Split the data into feature and label sets to avoid leakage during exploration, then used a Seaborn pairplot and a full correlation matrix to surface relationships between variables. Found that Fine Fuel Moisture Code (FFMC) had the strongest positive correlation with the Fire Weather Index (0.69), while relative humidity was strongly negatively correlated with fire risk (-0.58) — both consistent with known fire science. Also filtered the data to fire-only records and used box plots to compare feature ranges, finding Drought Code varied hugely (9–220) while rainfall stayed consistently low across fire events.

**Modelling** Split the data 80/20 for training/testing and trained a Decision Tree Classifier, using `export_text` to visualise the resulting decision logic (FFMC and Initial Spread Index were the dominant splitting features). Evaluated the model on the test set using a confusion matrix.

**Comparison against an unsupervised approach** To test an alternative method, standardised the features and ran K-means clustering (2 clusters) on the same data, then compared cluster assignments against the actual fire/no-fire labels.

## Result

The Decision Tree classified 18 of 20 test cases correctly (90% accuracy) with zero false negatives — it never missed an actual fire, only occasionally over-predicted one. K-means, by contrast, produced a silhouette score of 0.29, indicating poorly separated clusters — a useful negative result showing that the relationships between features were too complex and non-linear for a simple distance-based clustering approach to capture. 

## Reflections

The most interesting part was seeing how clearly the Decision Tree's actual decision path lined up with real fire science — FFMC and Initial Spread Index being the dominant splitting features tracks with what's already known about fuel moisture and fire spread. Running K-means alongside it was a useful contrast: it made concrete why model choice matters, not just data quality — the same dataset gave a strong result with one method and a weak one with another.   

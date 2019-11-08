import pandas as pd
import numpy as np

countries = pd.read_csv('data/country_info.csv')
countries = countries.filter(['alpha-2', 'region'])
ioc = pd.read_csv(
    'data/ioc.csv').filter(['NOC', 'ISO code']).rename(columns={'ISO code': 'alpha-2'})
merged = pd.merge(countries, ioc, how='inner', on='alpha-2')
merged.drop(columns=['alpha-2']).filter(['NOC', 'region']
                                        ).to_csv('data/code_dictionary.csv')

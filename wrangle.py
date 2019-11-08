import pandas as pd
import numpy as np


data = pd.read_csv('athlete_events.csv')
is_summer = data.Season == 'Summer'
code_dict = pd.read_csv('data/code_dictionary.csv',
                        header=0).set_index('NOC').to_dict()['region']


def continent_lookup(alpha):
    cont = code_dict.get(alpha)
    return cont


summer_oly = data[is_summer]

medals_per_noc = summer_oly.groupby(
    ['NOC', 'Team', 'Year']).count().reset_index()
medals_per_noc['Continent'] = medals_per_noc.apply(
    lambda x: continent_lookup(x['NOC']), axis=1)
medals_per_noc = medals_per_noc[['NOC', 'Team', 'Year', 'Continent', 'Medal']]
medals_per_noc.to_csv('data/nation_medal_count.csv')

thing = summer_oly.groupby(
    ['Name', 'Year', 'Sex', 'Sport', 'NOC']).count()[['Medal']]
thing = thing[thing.Medal > 0].sort_values('Year')
thing.to_csv('data/athlete_medal_count.csv')

summer_oly['Continent'] = summer_oly.apply(
    lambda x: continent_lookup(x['NOC']), axis=1)
athlete_count = summer_oly.groupby(['Year', 'Continent'])[[
    'Name']].nunique().rename({'Name': 'attended'})
athlete_count.to_csv("data/attending_athletes.csv")

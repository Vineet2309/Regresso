import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from gst import gst_sector
from tax import get_tax
from budget import get_budget
from news import policy
import json


theta = np.load("regresso_theta.npy")


base_columns = [
    'revenue', 'gst_change', 'corp_tax_change', 'budget_allocation', 'policy_sentiment',
    'sector_Agriculture', 'sector_Healthcare', 'sector_IT Services', 'sector_Manufacturing',
    'size_Small', 'size_Medium'
]


with open("../server/model/UsersInput.json") as f:
    raw = json.load(f)


profile = {
    "business_name": raw.get("Business Name") or raw.get("business_name") or "Unknown",
    "location": raw.get("State") or raw.get("location") or "Unknown",
    "business_size": (raw.get("Size") or raw.get("business_size") or "Small").capitalize(),
    "sector": raw.get("Sector") or raw.get("sector") or "Agriculture",
    "annual_revenue": raw.get("lastYRev") or raw.get("annual_revenue") or 0,
    "investment_plan": raw.get("investment_plan") or "Yes"
}


try:
    with open("known_states.json") as f:
        known_states = json.load(f)
except FileNotFoundError:
    known_states = []


if profile["location"] not in known_states:
    known_states.append(profile["location"])
    with open("known_states.json", "w") as f:
        json.dump(known_states, f)


location_columns = [f"location_{state}" for state in known_states]
feature_columns = base_columns + location_columns


encoded_input = {key: 0 for key in feature_columns}
encoded_input['revenue'] = profile['annual_revenue']
encoded_input['gst_change'] = gst_sector(profile['sector'])
encoded_input['corp_tax_change'] = get_tax(profile['sector'])
encoded_input['budget_allocation'] = get_budget(profile['sector'])
encoded_input['policy_sentiment'] = policy()[0]
encoded_input['sector_Agriculture'] = int(profile['sector'] == 'Agriculture')
encoded_input['sector_Healthcare'] = int(profile['sector'] == 'Healthcare')
encoded_input['sector_IT Services'] = int(profile['sector'] == 'IT Services')
encoded_input['sector_Manufacturing'] = int(profile['sector'] == 'Manufacturing')
encoded_input['size_Small'] = int(profile['business_size'] == 'Small')
encoded_input['size_Medium'] = int(profile['business_size'] == 'Medium')
encoded_input[f"location_{profile['location']}"] = 1

x = np.array([1] + [encoded_input.get(col, 0) for col in feature_columns], dtype=np.float64)
theta = theta.astype(np.float64)


if x.shape[0] != theta.shape[0]:
    missing = theta.shape[0] - x.shape[0]
    if missing > 0:
        x = np.append(x, [0]*missing)
    elif missing < 0:
        x = x[:theta.shape[0]]


prediction = x.dot(theta)
impact_score = round(float(np.clip(prediction, -1, 1)), 4)


def generate_suggestion(score, invest_flag):
    if score > 0.5:
        return "Invest in digital tools or market expansion."
    elif score < -0.5:
        return "Delay investments and cut non-essential expenses."
    elif invest_flag == 'Yes':
        return "Proceed with investment but monitor market signals."
    else:
        return "Stable condition. Reassess after policy update."

suggestion = generate_suggestion(impact_score, profile['investment_plan'])


result = {
    "business_name": profile['business_name'],
    "location": profile['location'],
    "impact_score": impact_score,
    "suggestion": suggestion,
    "gst_change": encoded_input['gst_change'],
    "corp_tax_change": encoded_input['corp_tax_change'],
    "budget_allocation": encoded_input['budget_allocation'],
    "policy_sentiment": encoded_input['policy_sentiment']
}

with open("regresso_output.json", "w") as f:
    json.dump(result, f, indent=4)


labels = ['GST Change', 'Corp Tax Change', 'Budget %', 'Policy Sentiment']
values = [encoded_input['gst_change'], encoded_input['corp_tax_change'], encoded_input['budget_allocation'], encoded_input['policy_sentiment']]
colors = ['blue', 'red', 'green', 'purple']

plt.figure(figsize=(6, 4))
plt.bar(labels, values, color=colors)
plt.title("Policy Inputs Affecting Impact Score")
plt.ylabel("% or Score")
plt.tight_layout()
plt.grid(True)
plt.savefig("regresso_graph.png")
plt.close()


normalized_values = [abs(v) for v in values]
total = sum(normalized_values)
proportions = [v / total for v in normalized_values] if total != 0 else [0.25] * 4

plt.figure(figsize=(6, 6))
plt.pie(proportions, labels=labels, autopct='%1.1f%%', colors=colors, startangle=140)
plt.title("Policy Factor Influence Proportion")
plt.savefig("regresso_pie_chart.png")
plt.close()

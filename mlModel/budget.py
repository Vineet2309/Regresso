def get_budget(sector_name):
    budget_mapping = {
        'Agriculture': 6.5,
        'Manufacturing': 12.0,
        'IT Services': 8.0,
        'Retail': 5.5,
        'Healthcare': 10.5
    }

    return budget_mapping.get(sector_name, 7.5)  


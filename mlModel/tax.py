def get_tax(sector=None):
    current_tax_change = -1.0  
    sector_tax = {
        'Manufacturing': -1.0,
        'IT Services': -0.5,
        'Healthcare': 0.0,
        'Retail': -0.3,
        'Agriculture': 0.0
    }
    return sector_tax.get(sector, -0.5)



def gst_sector(sector_name):
    sector_mapping = {
        'Retail': 12.0,
        'Manufacturing': 18.0,
        'IT Services': 18.0,
        'Agriculture': 5.0,
        'Healthcare': 0.0
    }
    return sector_mapping.get(sector_name, 12.0)


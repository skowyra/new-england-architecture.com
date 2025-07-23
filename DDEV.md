# DDEV Configuration

This project uses DDEV for local development.

## Setup Instructions

1. Install DDEV: https://ddev.readthedocs.io/en/stable/
2. Clone this repository
3. Run `ddev start` in the project directory
4. Run `ddev composer install`
5. Access the site at https://real-estate-photography.ddev.site

## Custom PHP Settings

The project includes custom PHP settings for handling large image files:
- Memory limit: 4GB
- Upload limit: 100MB
- Extended execution time for image processing

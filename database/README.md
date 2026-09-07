# MySQL Database Files Directory

This directory contains dedicated SQL files for database tables, schema creation, seed data, and a complete database dump for the **Bug Tracking System**.

---

## Directory Overview

```text
database/
├── dump.sql                 # Complete MySQL database export (Schema + Real Data)
├── schema.sql               # Combined master database initialization script
├── tables/
│   ├── users.sql            # Dedicated table structure for `users`
│   └── bugs.sql             # Dedicated table structure for `bugs`
└── seeds/
    ├── 01_users_data.sql    # Seed data for system users (Admin, Developer, Tester)
    └── 02_bugs_data.sql     # Seed data for sample bugs
```

---

## How to Import Data into MySQL

### Option 1: Import Complete Dump File
```bash
mysql -u root -p bug_tracker_db < database/dump.sql
```

### Option 2: Run Individual Table Scripts
```bash
# 1. Create Tables
mysql -u root -p bug_tracker_db < database/tables/users.sql
mysql -u root -p bug_tracker_db < database/tables/bugs.sql

# 2. Insert Seed Data
mysql -u root -p bug_tracker_db < database/seeds/01_users_data.sql
mysql -u root -p bug_tracker_db < database/seeds/02_bugs_data.sql
```

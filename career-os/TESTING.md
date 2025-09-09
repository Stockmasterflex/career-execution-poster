# Career OS Testing Guide

This document outlines the testing procedures for the Career OS application.

## Prerequisites

1. Set up a Supabase project
2. Run the database schema from `database/schema.sql`
3. Configure environment variables in `.env.local`
4. Start the development server: `npm run dev`

## Test Environment Setup

1. **Database Setup**
   - Create a new Supabase project
   - Run the schema SQL
   - Note down your project URL and anon key

2. **Environment Configuration**
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Test User Account**
   - Create a test user account through the sign-up flow
   - Use a test email address for easy identification

## Manual Testing Checklist

### 1. Authentication Flow

#### Sign Up
- [ ] Navigate to `/`
- [ ] Click "Sign Up" or toggle to sign up mode
- [ ] Enter valid email and password
- [ ] Verify user is created and logged in
- [ ] Check that user data appears in Supabase

#### Sign In
- [ ] Navigate to `/` (while logged out)
- [ ] Enter existing user credentials
- [ ] Verify successful login
- [ ] Check that dashboard loads with user data

#### Sign Out
- [ ] While logged in, click "Sign Out"
- [ ] Verify redirect to login page
- [ ] Verify user session is cleared

### 2. Weekly Schedule

#### Adding Schedule Blocks
- [ ] Navigate to dashboard
- [ ] Click "+ New block" on any day
- [ ] Fill in required fields (title, category, day, times)
- [ ] Add optional details
- [ ] Click "Create"
- [ ] Verify block appears in the correct day column
- [ ] Verify block has correct styling based on category

#### Editing Schedule Blocks
- [ ] Hover over an existing block
- [ ] Click the edit icon
- [ ] Modify title, category, times, or details
- [ ] Click "Update"
- [ ] Verify changes are reflected

#### Deleting Schedule Blocks
- [ ] Hover over an existing block
- [ ] Click the delete icon
- [ ] Verify block is removed
- [ ] Verify data is deleted from database

#### Time Validation
- [ ] Try to create a block with end time before start time
- [ ] Verify error message appears
- [ ] Verify block is not created

#### Navigation
- [ ] Click "Today" button
- [ ] Verify current day is highlighted
- [ ] Use previous/next week buttons
- [ ] Verify week changes correctly

### 3. Daily Non-Negotiables

#### Adding Tasks
- [ ] Navigate to dashboard
- [ ] In Morning Tasks section, type a new task
- [ ] Press Enter or click the + button
- [ ] Verify task appears in the list
- [ ] Repeat for Evening Tasks

#### Editing Tasks
- [ ] Click the edit icon next to a task
- [ ] Modify the task title
- [ ] Press Enter to save or Escape to cancel
- [ ] Verify changes are saved

#### Completing Tasks
- [ ] Click the checkbox next to a task
- [ ] Verify task shows as completed (strikethrough)
- [ ] Verify streak counter updates
- [ ] Uncheck the task
- [ ] Verify task shows as incomplete

#### Deleting Tasks
- [ ] Click the delete icon next to a task
- [ ] Verify task is removed
- [ ] Verify streak counter updates

### 4. KPI Management

#### Viewing KPIs
- [ ] Navigate to dashboard
- [ ] Verify 6 KPI cards are displayed
- [ ] Verify progress bars show correct percentages
- [ ] Verify phase indicators are shown

#### Editing KPIs
- [ ] Click the edit icon on a KPI card
- [ ] Modify current or target values
- [ ] Click the checkmark to save
- [ ] Verify progress bar updates
- [ ] Verify data is saved to database

#### Validation
- [ ] Try to enter negative values
- [ ] Try to enter non-numeric values
- [ ] Verify appropriate error handling

### 5. Company Management

#### Adding Companies
- [ ] Navigate to dashboard
- [ ] Click "Add Company"
- [ ] Fill in company name, tier, and status
- [ ] Add optional notes
- [ ] Click "Create"
- [ ] Verify company appears in the list

#### Filtering Companies
- [ ] Click different tier filters (All, T1A, T1B, T2)
- [ ] Verify only companies with selected tier are shown
- [ ] Verify status counters update correctly

#### Editing Companies
- [ ] Click the edit icon on a company
- [ ] Modify any field
- [ ] Click "Update"
- [ ] Verify changes are reflected

#### Deleting Companies
- [ ] Click the delete icon on a company
- [ ] Verify company is removed
- [ ] Verify status counters update

### 6. Data Export/Import

#### JSON Export
- [ ] Navigate to dashboard
- [ ] Click "Export JSON"
- [ ] Verify file downloads
- [ ] Open downloaded file
- [ ] Verify all user data is included

#### JSON Import
- [ ] Clear some data (delete a few items)
- [ ] Click "Import JSON"
- [ ] Select previously exported file
- [ ] Verify data is restored
- [ ] Verify all components update

#### PDF Export
- [ ] Click "Export PDF"
- [ ] Verify PDF is generated and downloads
- [ ] Open PDF and verify content
- [ ] Verify formatting is correct

### 7. Responsive Design

#### Mobile Testing
- [ ] Resize browser to mobile width
- [ ] Verify weekly schedule becomes accordion view
- [ ] Verify all buttons and forms are usable
- [ ] Test touch interactions

#### Desktop Testing
- [ ] Use full desktop width
- [ ] Verify grid layouts work correctly
- [ ] Test hover states
- [ ] Verify drag-and-drop functionality

### 8. Error Handling

#### Network Errors
- [ ] Disconnect internet
- [ ] Try to perform actions
- [ ] Verify error messages appear
- [ ] Reconnect and verify recovery

#### Validation Errors
- [ ] Try to submit forms with invalid data
- [ ] Verify appropriate error messages
- [ ] Verify forms don't submit invalid data

#### Database Errors
- [ ] Try to create duplicate data
- [ ] Verify appropriate error handling
- [ ] Verify user-friendly error messages

## Automated Testing

### Type Checking
```bash
npm run typecheck
```
- [ ] Verify no TypeScript errors

### Linting
```bash
npm run lint
```
- [ ] Verify no linting errors

### Build Verification
```bash
npm run build
```
- [ ] Verify build completes successfully
- [ ] Verify no build errors

## Performance Testing

### Load Testing
- [ ] Create 100+ schedule blocks
- [ ] Verify performance remains acceptable
- [ ] Test with large datasets

### Memory Testing
- [ ] Use browser dev tools to monitor memory usage
- [ ] Verify no memory leaks during extended use

## Security Testing

### Authentication
- [ ] Verify protected routes require authentication
- [ ] Verify users can only access their own data
- [ ] Test with invalid tokens

### Data Validation
- [ ] Try to submit malicious data
- [ ] Verify XSS protection
- [ ] Verify SQL injection protection

## Browser Compatibility

### Chrome
- [ ] Test all functionality
- [ ] Verify performance

### Firefox
- [ ] Test all functionality
- [ ] Verify performance

### Safari
- [ ] Test all functionality
- [ ] Verify performance

### Edge
- [ ] Test all functionality
- [ ] Verify performance

## Test Data Cleanup

After testing, clean up test data:
1. Delete test user account from Supabase
2. Clear browser storage
3. Reset any test configurations

## Reporting Issues

When reporting issues, include:
1. Browser and version
2. Steps to reproduce
3. Expected vs actual behavior
4. Screenshots if applicable
5. Console errors if any

## Test Results Template

```
Test Date: [DATE]
Tester: [NAME]
Browser: [BROWSER/VERSION]
Environment: [LOCAL/STAGING/PRODUCTION]

Passed Tests: [COUNT]
Failed Tests: [COUNT]
Skipped Tests: [COUNT]

Issues Found:
1. [ISSUE DESCRIPTION]
2. [ISSUE DESCRIPTION]

Overall Status: [PASS/FAIL]
```
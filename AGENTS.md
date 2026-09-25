# Repository guide

## What this project is
A Library management project which lets user borrow,return books and when the book is returned late fine gets auto calculated based on late days and create a record , using django sessions for authentication

## Tech stack
backend framework = Django/Django-rest_framework
database = postgresql
frontend = plain html,css,javascript 
testing = Drf APITestCase

## Commands
- run server: `python manage.py runserver`
- Tests: `python manage.py test`
- Add Books to Library: `python manage.py seed`

## Project structure
                            Library-Management-project
                                       |
                          ↓------------|-----------↓
                        Frontend/              Backend/   
                           ↓                      ↓
                        html/,css/,js/        library/, config/, accounts/

## Architecture rules
1. Do Not touch Backend carelessly because i'm still learning it
2. Youre here to automate the repetitive task i was tired of 
3. Always let frontend and backend be work indepentent never glue them 
4. Always teach something new even if it's my boring repetitive tasks 
5. Always Write production grade code to help me level up my thinking 

## Coding conventions
- Prefer small, focused modules with explicit types.
- Named exports only.
- Match existing component and file naming patterns before introducing new ones.
- Do not add a new dependency unless the existing stack cannot solve the problem.

## Good and bad examples
1. Do Not do - "Here your example/ endpoint is fully complete" instead Make the endpoint production level and help me understand why you made it that way, help improve my thinking 

## Boundaries
1. Never push secreats to github, write them carefully in .env and never push this file too



"""
Django management command to seed the database with real books.

WHERE THIS FILE GOES:
  library/management/commands/seed_books.py

You need two empty folders with an __init__.py in each (management commands
won't be discovered without them):
  library/management/__init__.py
  library/management/commands/__init__.py

HOW TO RUN:
  python manage.py seed_books
"""

from django.core.management.base import BaseCommand
from library.models import Book

BOOKS = [
    ("The Alchemist", "Paulo Coelho", "Fiction"),
    ("Pride and Prejudice", "Jane Austen", "Fiction"),
    ("Moby-Dick", "Herman Melville", "Fiction"),
    ("War and Peace", "Leo Tolstoy", "Fiction"),
    ("The Odyssey", "Homer", "Fiction"),
    ("Fahrenheit 451", "Ray Bradbury", "Fiction"),
    ("Slaughterhouse-Five", "Kurt Vonnegut", "Fiction"),
    ("The Old Man and the Sea", "Ernest Hemingway", "Fiction"),
    ("Jane Eyre", "Charlotte Bronte", "Fiction"),
    ("Wuthering Heights", "Emily Bronte", "Fiction"),
    ("A Clash of Kings", "George R.R. Martin", "Fantasy"),
    ("The Two Towers", "J.R.R. Tolkien", "Fantasy"),
    ("The Name of the Wind", "Patrick Rothfuss", "Fantasy"),
    ("Mistborn", "Brandon Sanderson", "Fantasy"),
    ("Harry Potter and the Chamber of Secrets", "J.K. Rowling", "Fantasy"),
    ("Ender's Game", "Orson Scott Card", "Science Fiction"),
    ("Brave New World Revisited", "Aldous Huxley", "Science Fiction"),
    ("The Left Hand of Darkness", "Ursula K. Le Guin", "Science Fiction"),
    ("Snow Crash", "Neal Stephenson", "Science Fiction"),
    ("The Martian", "Andy Weir", "Science Fiction"),
    ("Educated", "Tara Westover", "Non-Fiction"),
    ("Man's Search for Meaning", "Viktor E. Frankl", "Non-Fiction"),
    ("A Brief History of Time", "Stephen Hawking", "Non-Fiction"),
    ("Guns, Germs, and Steel", "Jared Diamond", "Non-Fiction"),
    ("Outliers", "Malcolm Gladwell", "Non-Fiction"),
    ("The Innovator's Dilemma", "Clayton Christensen", "Business"),
    ("Good to Great", "Jim Collins", "Business"),
    ("Rich Dad Poor Dad", "Robert Kiyosaki", "Business"),
    ("You Don't Know JS", "Kyle Simpson", "Programming"),
    ("Refactoring", "Martin Fowler", "Programming"),
]


class Command(BaseCommand):
    help = "Seeds the database with 30 real books"

    def handle(self, *args, **options):
        created_count = 0
        skipped_count = 0

        for title, author, category in BOOKS:
            book, created = Book.objects.get_or_create(
                title=title,
                author=author,
                defaults={"catagory": category},
            )
            if created:
                created_count += 1
            else:
                skipped_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Done. {created_count} books created, {skipped_count} already existed."
            )
        )

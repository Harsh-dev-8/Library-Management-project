from .models import Fine

def calculate_fine(data):
    book = data.get('book')
    record = data.get('record')
    user = data['request'].user

    if record.return_date > record.expected_return_date:
        full_due_days = record.return_date - record.expected_return_date
        due_days = full_due_days.days
        if due_days == 0:
            return data
        else:
            amount = due_days * 100

            Fine.objects.create(
                user=user,
                book=book,
                borrow_record=record,
                amount=amount,
                fine_days=due_days,
                status="unpaid"
            )
    return data

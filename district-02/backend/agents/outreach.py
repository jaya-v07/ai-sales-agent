from models.schemas import EmailStep


def generate_outreach(company, intent):
    name = company["name"].split()[0]
    product = intent.product
    signal = company["signals"][0].lower()
    return [
        EmailStep(day=0, subject=f"A thought on {company['company']}'s engineering momentum", body=f"Hi {name},\n\nI noticed {company['company']} is {signal}. Teams at that stage often need to keep delivery moving while new systems and people come online.\n\nWe help engineering leaders improve developer flow with a {product}. Would a brief comparison of priorities be useful?\n\nBest,"),
        EmailStep(day=3, subject="Re: engineering momentum", body=f"Hi {name},\n\nFollowing up on my note about {company['company']}. The signal we reviewed was {signal}; that is why I thought developer productivity may be timely.\n\nOpen to a short conversation next week?\n\nBest,"),
        EmailStep(day=7, subject="Close the loop?", body=f"Hi {name},\n\nI’ll close the loop after this. If improving engineering flow is not a current focus for {company['company']}, no need to reply. If it is, I can share a concise overview tailored to growing backend teams.\n\nBest,"),
    ]

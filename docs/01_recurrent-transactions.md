# Recurrent Transactions

[TOC]

## Requirements

1. The user can define an expense or an income (but not a transfer) as a recurrent transaction.
1. Recurrent transaction have named identifiers and can be specified to run:
   - a given number of times, or
   - until a specified date.
1. All transactions form a recurrent transaction are based of the first transaction.
1. When the user modifies one transaction in the series, they can specify choose to:
   - only modify the selected transaction,
   - modify the selected and all future transactions, or
   - modify all the transactions in the series.

## Design

### Recurrence

In order to have _recurrent transactions_, the system needs a new concept.
A way of expressing the frequency or cycle in which the transactions will repeat.
Its `recurrence`.

After exercising the most important skill of any developer (_googling_) I found an RFC that solves this problem.
Taking a look at [RFC 5545](https://datatracker.ietf.org/doc/html/rfc5545) [section 3.3.10](https://datatracker.ietf.org/doc/html/rfc5545#section-3.3.10) you can find the definition of the _Recurrence Rule_ or _RECUR_.

<!-- They allow to define recurrence almost too well. -->

The breath of possibilities this structure allows borders on being overkill, but using has the benefits of removing the need to think about most edge cases and not needing to write the logic for parsing or computing dates based on this rules as there are libraries that do such thing.
Sometimes the best solution is to _use_ an existing solution.

My `recurrent transaction definitions` then hold a name, the RECUR for the `recurrence`, a `finished_at` attribute that will mark which ones no longer need to be checked for new instances and a self-explanatory `last_transaction_date`.

<!-- With an expression to define when the next event will happen,
It allows to express events as specific as _repeating the 28th of every odd-month, but only on weekends_. -->

### Transactions in a series

<!-- How does the system knows the details of the transaction to be generated ? -->

There is a one-to-many relationship from the recurrence to the transactions.
As simple as it gets.
This allows us to trace if any given transaction is recurrent.
I will omit enumerating each occurrence since I don't see an immediate benefit in doing so.

### Generating the instances of recurrent transactions

_How do we know when the next instance is going to occur?_
As I said before, the computation of the dates will be done by a library ([rrule]()).
For the rest of the attributes, the system needs a template or _base transaction_ to generate the new ones.
One option was to include all the attributes of the transaction in the `recurrent transaction`, but note that the only thing that changes from instance to instance in the series is the _date_.
The first transaction (the one entered manually by the user) is just that, a _base transaction_.
It is enough to generate the new date and reference said _base_ for the other attributes.

For implementation, a service handles the actual generation on a schedule, managed either by the app or a _cronjob_.
After every successful run, it caches the _last_run_date_ so that if the the service restarts, it will not try to generate transactions more frequently than needed.

### Modifying a transaction in the series

Finally, I support three cases:

- Only modify a single transaction in the series,
- modify the selected and all future transactions and
- modify all the transactions in the series.

Changing only one or all transaction are self-evident cases.
For the other one, the _modify the selected and all future transactions_, one could argue that for all future transaction yet to be generated the _base transaction_ is changing.
The `recurrent transaction definition`'s _base transaction_ relationship can be updated to point towards the transaction that was just modified and then updated all posterior instances to said transaction in the series.
These are related to the series by the many-to-one relationship with the `recurrent transaction` so no information of interest is lost.

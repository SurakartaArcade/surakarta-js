# Surakarta (JavaScript implementation)

This is a "stateful" library for managing Surakarta games in JavaScript projects.

## Installation

```
npm install surakarta@latest
```

## Usage

In this project, we refer to the pieces as "pebbles". A pebble position is filled with one of three values: `RED_PLAYER`, `BLACK_PLAYER`, and `NOT_FILLED`. Here, the red player refers to the one that moves first while the black player is the other one.

```js
import { Surakarta, RED_PLAYER, BLACK_PLAYER } from 'surakarta';

class App {
  constructor() {
    this.surakarta = new Surakarta();
  }
}
```

## Documentation

Surakarta objects have these properties:

* `states: Array<number>`: This an array of 36 values that indicate which pebbles lie on each position. You can access it using `indexOf(row, column)` if convinient.

* `turn: number`: This is the no. of moves that have occured in the game already. To get the turning player, see `turnPlayer()`, which returns either `RED_PLAYER` or `BLACK_PLAYER`.

* `responders: Array<SurakartaResponder>[3]`: This is an array of array of responder objects (see `SurakartaResponder` interface below). `responders[0]` are invoked when it is the red player's turn; `responders[1]` are invoked when it is the black player's turn. `responders[2]` are invoked on both player's turns; however, they are notified before the other two.

> `SurakartaResponder` is an interface for objects that listen to events in the game. They should have an `onTurn(surakartaInstance: Surakarta)` method.

> TODO: Contribute by finishing this documentation!
>

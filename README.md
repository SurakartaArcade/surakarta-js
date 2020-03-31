[![Build Status](https://dev.azure.com/SurakartaArcade/Surakarta/_apis/build/status/SurakartaArcade.surakarta-js?branchName=master)](https://dev.azure.com/SurakartaArcade/Surakarta/_build/latest?definitionId=1&branchName=master)

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

* `turn: number`: This is the no. of moves that have occured in the game already. To get the turning player, see `turnPlayer`, which returns either `RED_PLAYER` or `BLACK_PLAYER`.

* `responders: Array<SurakartaResponder>[3]`: This is an array of array of responder objects (see `SurakartaResponder` interface below). `responders[0]` are invoked when it is the red player's turn; `responders[1]` are invoked when it is the black player's turn. `responders[2]` are invoked on both player's turns; however, they are notified before the other two.

> `SurakartaResponder` is an interface for objects that listen to events in the game. They should have an `onTurn(surakartaInstance: Surakarta)` method.

### Surakarta Class

```js
import { Surakarta } from 'surakarta`;
```

This is the only class that users have to familiarize with. It manages the state of a single, active Surakarta game. Apart from the properties mentioned above, the Surakarat provides the following API methods:

**step**
```js
step(rs: number, cs: number, rd: number, cd: number, noResponder: boolean = false, capture: boolean = false): Void
```

The step method allows you to move a pebble to from position `(rs,cs)` to position `(rd,cd)`. It does not do any validation of whether the move is valid, but only if the moving piece is the turning player's and if a capture is occuring when `capture=false`. If either of these conditions are negative, then an error is thrown.

A valid move would be where the pebble is moving one-step orthogonally or diagonally. Also, direct captures are not allowed in the Surakarta game. To validate these conditions, see `safeStep` below.

_`noRespond`_: Setting this to false means that Surakarta will not treat this operation as a turning move, i.e. the turn won't be incremented and the responders won't be notified.

**safeStep**
```js
safeStep(rs: number, cs: number, rd: number, cd: number, noResponder: boolean): boolean
```

This safe-step method only passes moves that are valid, non-capturing step moves. `It internally uses the global API function `validateStep`. It also returns `true` if the move was valid.

**traverse**
```js
traverse(r: number, c: number, dir: Directions, cut: [number, number] = null, saveSteps: boolean = true, perform: boolean = true, noRespond: boolean = false): {boolean | Array<[number,number]> | null}
```

Verifies capturing moves & operates them. The capturing move starts from `(r,c)` in the initial direction `dir`. It is valid iff its ends up on an enemy pebble.

`saveSteps` will tell this method to keep each intermediate position (including the last one) in an array and return them. If the move isn't valid, `null` will be returned instead. However, if `saveSteps` is set to `false`, then a boolean value will be returned indicating that the move is valid or not.

Surakarta's rules allow to make the "capture" optional, i.e. you can stop at an intermediate position. To indicate that you want to stop at such a position, you can set `cut` to a valid position that lies on the capturing move's path; however, if it does not lie on that path, it will be ignored.

`perform=false` will prevent the actual move from happening. It is useful to just get the intermediate positions if such a move were to occur.

**forEach**
```js
forEach(callback: (state: number, r: number, c: number) => Void): Void
```

Iterator function that calls the `callback` function for each position state, providing the state value, row, and column. It is useful when a for-loop is not tasteful.

**clone**
```js
clone(): Surakarta
```

Clones this game's state without the responders. This is useful when you want to save the history of the game.

**indexOf**
```js
indexOf(r: number, c: number): number
```

Returns the index of the position in the `states` array.

### Players enum

```js
import {
  RED_PLAYER,
  BLACK_PLAYER,
  NOT_FILLED
} from 'surakarta';
```

This enum is used to indicate which player's pebble lies on a certain position. The `RED_PLAYER` is the one that moves first while the black one moves after. A `NOT_FILLED` indicates that the position is not held by any plaer.

### Directions enum

```js
import { Directions } from 'surakarta';

const {
  LEFT,
  UP,
  RIGHT,
  DOWN
} = Directions;
```

This enum is used to commnicate directions of capturing moves.

> TODO: Contribute by finishing this documentation!
>

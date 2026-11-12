---
meta-title: Markdown Demo
meta-description: Every markdown edge case the lander should render.
empty-value:
quoted: "a: string with a colon"
list-value: [ a, b ]
---

# ALTERED

ALTERED is the data control platform for humans in the AI era: a managed, minimal, dynamic source of truth with an alignment and integration agent called **Koa** (short for _Knowledge Orchestration Agent_).

## Emphasis

Asterisk _italic_, underscore _italic_, asterisk **bold**, underscore **bold**, **_bold italic_**, _**bold italic**_, _**mixed outer underscore**_, **_mixed outer asterisk_**, and _**mixed again**_.

Nested: **bold with _italic_ inside**, _italic with **bold** inside_, and **bold with `code` and a [link](/koa) inside**.

Intraword: un*frigging*believable, but snake_case_words_stay_plain and 2*3*4 is math.

~~Strikethrough~~ and ~single tilde~ (GFM only).

Escapes: \*not italic\*, \_not italic\_, \# not a heading, \- not a list, \`not code\`, \[not a link\](nope), and a lone backslash \ in the middle.

Entities: &copy; &amp; &lt;tag&gt; &nbsp;non-breaking &#8212; and &mdash; dashes.

Typography: "straight quotes", “curly quotes”, it's, ellipsis..., em — dash, en – dash, arrows -> and <-, and emoji 🧠.

## Inline Code

Single `code`, double ``code with a ` backtick``, padded `` `wrapped` ``, triple `three`, empty-ish `` ` `` and a long one `const thoughts = await koa.memory.search({ query: "what did I decide about Raycast?" })` that should wrap.

## Links

Inline [relative](/koa), [anchor](#links), [absolute](https://altered.computer), [with title](https://altered.computer "The title"), [email](mailto:hello@altered.computer), [phone](tel:+15555555555), and [**bold label**](/koa).

Autolinks <https://altered.computer> and <hello@altered.computer>, and a bare URL https://altered.computer (GFM only).

Reference style: [full reference][koa-ref], [collapsed reference][], and [shortcut reference].

A long link: [read the whole decision record](https://github.com/alteredcomputer/altered-generated-kb/blob/main/decisions.md#d236-raycast-back-on-the-table).

[koa-ref]: /koa "Koa"
[collapsed reference]: https://altered.computer
[shortcut reference]: <https://altered.computer/with spaces>

## Images

![ALTERED logo](/favicon.ico)

Inline ![icon](/favicon.ico "Icon title") inside a sentence.

## Line Breaks

A soft line break
continues the same paragraph.

A backslash hard break\
and a two-space hard break  
and a plain soft break
end here.

A very long single line that goes well past the sixty-four character measure so that it has to wrap at least once or twice in the rendered output.

## Headings

### Third Level

#### Fourth Level

##### Fifth Level

###### Sixth Level

# Extra Spaces After Hashes

## Closing Hashes

# Setext Level One

## Setext Level Two

## Lists

- Dash item
- Dash item with a long line that wraps past the measure so we can see how the hanging indent behaves.
-   Dash item with extra spaces

* Star item
* Star item

- Plus item
- Plus item

1. First
2. Second
3. Third

1) Paren first
2) Paren second

7. Starts at seven
8. Then eight
9. Then nine
10. Then ten, wider marker

11. All ones
12. All ones
13. All ones

- Nested:
  - Second level
    - Third level
      - Fourth level
  - Back to second
- Back to first

1. Ordered with nested unordered:
   - Child
   - Child
2. Ordered again
   1. Nested ordered
   2. Nested ordered

- Loose list item one

- Loose list item two

  With a second paragraph.

- Loose list item three

- Item with a code block:

  ```ts
  const loose = true
  ```

- Item with a quote:

  > Quoted inside a list.

- [ ] Task unchecked (GFM only)
- [x] Task checked (GFM only)

-
Empty first line item

-

- Item after an empty item

## Blockquotes

> A single-line quote.

>   "A quote with extra spaces after the marker".
> And a second line.

> First paragraph of a quote.
>
> Second paragraph of the same quote.

> Lazy continuation starts here
> and continues without a marker.

> Outer quote
> > Nested quote
> > > Doubly nested quote

> ## A heading inside a quote
>
> - A list inside a quote
> - Another item
>
> ```
> code inside a quote
> ```

> A quote with **bold**, _italic_, `code`, and a [link](/koa), long enough to wrap past the measure at least once.

## Code

```
No language.
```

```ts
const koa = createAgent({ name: "Koa" })

if (koa.isReady) {
    console.log("tab-indented line")
    console.log("space-indented line")
}
```

```json title="example.json"
{
    "name": "Jane, this is a really long string, nooooo name should be this long but I want to see what happens",
    "age": 25
}
```

```
Tilde fence.
```

````md
```
A fence inside a longer fence.
```
````

```

```

    Indented code block line one
    Indented code block line two

        Extra indented line

```sh
pnpm dev --filter web-marketing-experimental && echo "a very long command line that should wrap"
```

## Thematic Breaks

---

---

---

---

Text directly above a break

---

Text directly below a break.

## Tables

| Feature  |   Status    |  Notes |
| :------- | :---------: | -----: |
| Koa loop | In progress | Nov 14 |
| Memory   |   Planned   |   `v0` |
| Data API |   Planned   |  Dec 5 |

## HTML

<details>
<summary>Raw HTML block</summary>

Hidden content.

</details>

Inline <kbd>D</kbd> and <br> and a <span>span</span>.

<!-- An HTML comment that should probably not render. -->

## Footnotes

ALTERED keeps every thought versioned.[^versioning] Koa answers over SMS.[^sms]

[^versioning]: Every change is a new version, approved before it lands.
[^sms]: Through Sendblue for now.

## Edge Spacing

Three blank lines above this paragraph (capped to two).
Trailing spaces on this line without a break
and a final line.

## Nested and Wide

| Column one | Column two | Column three | Column four | Column five |
| ---------- | :--------: | -----------: | ----------- | ----------- |
| a          |   **b**    |          `c` | [d](/koa)   | e           |

> | In  | Quote |
> | --- | ----- |
> | 1   | 2     |

>
> Content below a lone marker.

- [ ] A task item with a long enough line that it has to wrap past the measure.

1. Item

   > Quote in an ordered item
   > with a soft break.

   ```ts
   const inItem = true
   ```

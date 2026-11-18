declare const brand: unique symbol

type Brand<Type, Name> = Type & { [brand]: Name }

export { type Brand, brand }

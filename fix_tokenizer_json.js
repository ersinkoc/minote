// This script demonstrates a potential fix for the tokenizer
// to handle JSON objects within arrays

const testInput = `users: [{"id":1,"name":"Alice"} {"id":2,"name":"Bob"}]`

console.log('Test input:', testInput)
console.log('The issue: Tokenizer sees "{" as an unexpected character')
console.log('Solution: Teach tokenizer to recognize JSON objects as special quoted strings')

// The fix would be in tokenizer.ts - in scanToken method,
// when we encounter "{" inside an array, treat it as start of JSON object
// until we find the matching "}"
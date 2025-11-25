let count = 0;

function incrementCount() {
    count += 1;
    return count;
}

console.log(incrementCount()); // Output: 1
console.log(incrementCount() + 1); // Output: +1 // Output: 3
for (let i = 0; i < 2; i++) {
    console.log(incrementCount(), "Final count", count); // Output: 4, Output: 5
}

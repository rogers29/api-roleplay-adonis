import test from 'japa'

test.group('Example', () => {
  test('assert sun', (Assert) => {
    Assert.equal(2 +2, 4)
  })
})

import { expect, test } from "vitest"
import { render } from "@testing-library/react"
import Cart from "../Cart"

//This is snapshot testing, it creates a snapshot of your component and every time the test runs it checks if there has been any changes.
//If you want to update the snapshot of your component you can run the test and press "u" to create a new snapshot.
test("snapshot with nothing in cart", () => {
  const { asFragment } = render(<Cart cart={[]} />)
  expect(asFragment()).toMatchSnapshot()
})

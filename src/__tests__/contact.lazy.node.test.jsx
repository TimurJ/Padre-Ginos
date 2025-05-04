import { render } from "@testing-library/react"
import { expect, test, vi } from "vitest"
import createFetchMock from "vitest-fetch-mock"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import { Route } from "../routes/contact.lazy"

const queryClient = new QueryClient()
const fetchMocker = createFetchMock(vi)
fetchMocker.enableMocks()

test("can submit contact form", async () => {
  fetchMocker.mockResponse(JSON.stringify({ status: "ok" }))
  const screen = render(
    <QueryClientProvider client={queryClient}>
      <Route.options.component />
    </QueryClientProvider>,
  )

  const nameInput = screen.getByPlaceholderText("Name")
  const emailInput = screen.getByPlaceholderText("Email")
  const messageInput = screen.getByPlaceholderText("Message")

  const testData = {
    name: "Timur",
    email: "timur@example.com",
    message: "Hello World",
  }

  nameInput.value = testData.name
  emailInput.value = testData.email
  messageInput.value = testData.message

  const button = screen.getByRole("button")
  button.click()

  const h3 = await screen.findByRole("heading", { level: 3 })

  expect(h3.innerText).toContain("Submitted")

  const requests = fetchMocker.requests()
  expect(requests.length).toBe(1)
  expect(requests[0].url).toBe("api/contact")
  expect(fetchMocker).toHaveBeenCalledWith("api/contact", {
    body: JSON.stringify(testData),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  })
})

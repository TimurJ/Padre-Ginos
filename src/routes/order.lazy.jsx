import { useContext, useEffect, useState } from "react"
import Pizza from "../Pizza"
import Cart from "../Cart"
import { CartContext } from "../contexts"
import { createLazyFileRoute } from "@tanstack/react-router"

export const Route = createLazyFileRoute("/order")({
  component: Order,
})
const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

function Order() {
  const [pizzaTypes, setPizzaTypes] = useState([])
  const [pizzaType, setPizzaType] = useState("pepperoni")
  const [pizzaSize, setPizzaSize] = useState("M")
  const [cart, setCart] = useContext(CartContext)
  const [loading, setLoading] = useState(true)

  async function checkout() {
    setLoading(true)

    await fetch("/api/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cart }),
    })

    setCart([])
    setLoading(false)
  }

  let price, selectedPizza

  if (!loading) {
    selectedPizza = pizzaTypes.find((pizza) => pizzaType === pizza.id)
    price = intl.format(selectedPizza.sizes[pizzaSize])
  }

  async function fetchPizzaTypes() {
    const pizzaRes = await fetch("/api/pizzas")
    const pizzaJson = await pizzaRes.json()
    setPizzaTypes(pizzaJson)
    setLoading(false)
  }

  useEffect(() => {
    fetchPizzaTypes()
  }, [])

  return (
    <div className="order-page">
      <div className="order">
        <h2>Create Order</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            setCart([...cart, { pizza: selectedPizza, size: pizzaSize, price }])
          }}
        >
          <div>
            <div>
              <label htmlFor="pizza-type">Pizza Type</label>
              <select
                onChange={(event) => {
                  setPizzaType(event.target.value)
                }}
                name="pizza-type"
                value={pizzaType}
              >
                {pizzaTypes.map((pizza) => (
                  <option value={pizza.id} key={pizza.id}>
                    {pizza.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="pizza-size">Pizza Size</label>
              <div>
                <span>
                  <input
                    type="radio"
                    checked={pizzaSize === "S"}
                    name="pizza-size"
                    value="S"
                    id="pizza-s"
                    onChange={(e) => {
                      setPizzaSize(e.target.value)
                    }}
                  />
                  <label htmlFor="pizza-s">Small</label>
                </span>
                <span>
                  <input
                    type="radio"
                    checked={pizzaSize === "M"}
                    name="pizza-size"
                    value="M"
                    id="pizza-m"
                    onChange={(e) => {
                      setPizzaSize(e.target.value)
                    }}
                  />
                  <label htmlFor="pizza-m">Medium</label>
                </span>
                <span>
                  <input
                    type="radio"
                    checked={pizzaSize === "L"}
                    name="pizza-size"
                    value="L"
                    id="pizza-l"
                    onChange={(e) => {
                      setPizzaSize(e.target.value)
                    }}
                  />
                  <label htmlFor="pizza-l">Large</label>
                </span>
              </div>
            </div>
            <button type="submit">Add to Cart</button>
          </div>
          {loading ? (
            <h1>Loading...</h1>
          ) : (
            <div className="order-pizza">
              <Pizza
                name={selectedPizza.name}
                description={selectedPizza.description}
                image={selectedPizza.image}
              />
              <p>{price}</p>
            </div>
          )}
        </form>
      </div>
      {loading ? <h2>Loading...</h2> : <Cart cart={cart} checkout={checkout} />}
    </div>
  )
}

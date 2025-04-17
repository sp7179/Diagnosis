import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

export const maxDuration = 30

export async function POST(req) {
  // Fallback mechanism in case OpenAI API is not available
  const ENABLE_FALLBACK = true // Set to true to enable fallback mode
  let lastMessage // Declare lastMessage here
  try {
    const { messages } = await req.json()

    // Process the last message to check for chart-related queries
    lastMessage = messages[messages.length - 1]
    let response

    if (lastMessage.role === "user") {
      const userMessage = lastMessage.content.toLowerCase()

      // Check if the message is asking for a chart or data visualization
      if (
        userMessage.includes("chart") ||
        userMessage.includes("graph") ||
        userMessage.includes("data") ||
        userMessage.includes("visualization") ||
        userMessage.includes("sales") ||
        userMessage.includes("statistics") ||
        userMessage.includes("metrics") ||
        userMessage.includes("analytics") ||
        userMessage.includes("show me") ||
        userMessage.includes("display") ||
        userMessage.includes("create") ||
        userMessage.includes("generate")
      ) {
        // Generate sample data based on the query
        const chartData = generateChartData(userMessage)

        try {
          // Create a response with the chart data embedded
          const result = await streamText({
            model: openai("gpt-4o"),
            messages,
            temperature: 0.7,
            system: `You are a data visualization assistant with a vibrant, enthusiastic personality. When users ask for data or charts, provide a helpful, engaging response and include the chart data in a special format that the UI can parse. The chart data should be formatted as: CHART_DATA:{"type":"chart_type","title":"chart_title","data":[...]}END_CHART_DATA. Don't mention this format to the user. Use emoji occasionally to make your responses more engaging. Be creative with your explanations and suggest insights about the data.`,
          })

          // Get the text response and append chart data
          const textResponse = await result.text
          console.log("Generated response:", textResponse)
          console.log("Adding chart data to response")

          // Make sure we have a clean response with chart data properly appended
          return new Response(`${textResponse.trim()}\n\nCHART_DATA:${JSON.stringify(chartData)}END_CHART_DATA`)
        } catch (error) {
          console.error("Error generating OpenAI response:", error)

          // Fallback response with chart data
          const fallbackResponse =
            "I've analyzed your request and prepared some data visualization for you! Here's what I found:"
          return new Response(`${fallbackResponse}\n\nCHART_DATA:${JSON.stringify(chartData)}END_CHART_DATA`)
        }
      } else {
        // Regular chat response without chart data
        const result = await streamText({
          model: openai("gpt-4o"),
          messages,
          temperature: 0.7,
          system: `You are a helpful assistant that specializes in data analysis and visualization. You have a vibrant, enthusiastic personality. You can explain complex data concepts in simple terms and suggest appropriate visualizations for different types of data. Use emoji occasionally to make your responses more engaging. If users seem interested in data visualization, encourage them to ask for specific charts or visualizations.`,
        })

        // Return the text response directly
        const textResponse = await result.text
        return new Response(textResponse)
      }
    } else {
      // Regular chat response without chart data
      const result = await streamText({
        model: openai("gpt-4o"),
        messages,
        temperature: 0.7,
        system: `You are a helpful assistant that specializes in data analysis and visualization. You have a vibrant, enthusiastic personality. You can explain complex data concepts in simple terms and suggest appropriate visualizations for different types of data. Use emoji occasionally to make your responses more engaging. If users seem interested in data visualization, encourage them to ask for specific charts or visualizations.`,
      })

      // Return the text response directly
      const textResponse = await result.text
      return new Response(textResponse)
    }
  } catch (error) {
    console.error("API route error:", error)

    if (ENABLE_FALLBACK && lastMessage?.role === "user") {
      // Generate fallback chart data
      const chartData = generateChartData(lastMessage.content.toLowerCase())
      const fallbackResponse =
        "I've analyzed your request and prepared some data visualization for you! Here's what I found:"
      return new Response(`${fallbackResponse}\n\nCHART_DATA:${JSON.stringify(chartData)}END_CHART_DATA`)
    }

    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
}

function generateChartData(query) {
  // Determine chart type based on query
  let chartType = "bar" // default
  if (query.includes("line") || query.includes("trend") || query.includes("over time")) {
    chartType = "line"
  } else if (query.includes("pie") || query.includes("distribution") || query.includes("share")) {
    chartType = "pie"
  } else if (query.includes("area")) {
    chartType = "area"
  } else if (query.includes("radial")) {
    chartType = "radial"
  }

  // Generate title based on query
  let title = "Data Visualization"
  if (query.includes("sales")) {
    title = "Sales Performance"
  } else if (query.includes("revenue")) {
    title = "Revenue Analysis"
  } else if (query.includes("user") || query.includes("customer")) {
    title = "User Metrics"
  } else if (query.includes("market")) {
    title = "Market Analysis"
  } else if (query.includes("budget")) {
    title = "Budget Allocation"
  } else if (query.includes("profit")) {
    title = "Profit Margins"
  }

  // Generate sample data with more variation
  let data = []
  const randomFactor = () => Math.random() * 0.5 + 0.75 // 0.75 to 1.25

  if (chartType === "pie") {
    // For pie charts, create category-based data
    const categories = ["Product A", "Product B", "Product C", "Product D", "Product E"]
    data = categories.map((cat) => ({
      name: cat,
      value: Math.floor(Math.random() * 1000) + 100,
    }))
  } else {
    // For other charts, create time-series data
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const selectedMonths = months.slice(0, 6) // Use last 6 months

    // Create a base trend (upward, downward, or volatile)
    const trendType = Math.floor(Math.random() * 3)
    let baseValue = Math.floor(Math.random() * 300) + 200

    data = selectedMonths.map((month, index) => {
      // Apply the trend
      if (trendType === 0) {
        // Upward trend
        baseValue = baseValue * (1 + index * 0.1 * randomFactor())
      } else if (trendType === 1) {
        // Downward trend
        baseValue = baseValue * (1 - index * 0.08 * randomFactor())
      } else {
        // Volatile
        baseValue = baseValue * (1 + (Math.random() * 0.4 - 0.2))
      }

      baseValue = Math.max(50, Math.min(1000, baseValue)) // Keep within reasonable range
      const actualValue = Math.floor(baseValue)

      // For more complex charts, add additional metrics
      if (query.includes("compare") || title === "Sales Performance" || Math.random() > 0.5) {
        return {
          name: month,
          value: actualValue,
          target: Math.floor(actualValue * (Math.random() * 0.4 + 0.8)), // Target is 80-120% of actual
          previous: Math.floor(actualValue * (Math.random() * 0.4 + 0.6)), // Previous is 60-100% of actual
        }
      }

      return {
        name: month,
        value: actualValue,
      }
    })
  }

  return {
    type: chartType,
    title: title,
    data: data,
  }
}

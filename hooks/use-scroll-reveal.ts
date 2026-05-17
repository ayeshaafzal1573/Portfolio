import { useEffect } from "react"

export function useScrollReveal() {
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px 0px -40px 0px",
      threshold: 0.05,
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active")
          // Stop observing once active to prevent layout shifts
          observer.unobserve(entry.target)
        }
      })
    }, observerOptions)

    const registerElements = () => {
      const elements = document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-scale")
      elements.forEach((el) => {
        if (!el.classList.contains("active")) {
          observer.observe(el)
        }
      })
    }

    // Run registration initially
    registerElements()

    // Observe layout changes for lazy-loaded or state-hydrated DOM elements
    const mutationObserver = new MutationObserver(() => {
      registerElements()
    })

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    })

    return () => {
      observer.disconnect()
      mutationObserver.disconnect()
    }
  }, [])
}

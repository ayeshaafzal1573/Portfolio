"use client"

import { Brain, Zap, Target, Sparkles } from "lucide-react"

const aiProjects = [
  {
    icon: Brain,
    title: "Natural Language Processing Tool",
    description:
      "Advanced NLP system for sentiment analysis, entity recognition, and text summarization using transformer models.",
    features: ["Real-time analysis", "Multi-language support", "Custom model training"],
    demoUrl: "#",
  },
  {
    icon: Target,
    title: "Custom Recommendation Engine",
    description:
      "Machine learning-powered recommendation system with collaborative filtering and deep learning approaches.",
    features: ["Personalized recommendations", "A/B testing integration", "Real-time updates"],
    demoUrl: "#",
  },
  {
    icon: Zap,
    title: "AI-Powered Design Assistant",
    description:
      "Intelligent design tool that generates UI components and suggests improvements based on design principles.",
    features: ["Component generation", "Accessibility checks", "Design system integration"],
    demoUrl: "#",
  },
  {
    icon: Sparkles,
    title: "Predictive Analytics Dashboard",
    description: "Business intelligence platform with machine learning models for forecasting and trend analysis.",
    features: ["Time series forecasting", "Anomaly detection", "Interactive visualizations"],
    demoUrl: "#",
  },
]

export function AIShowcaseSection() {
  return (
    <section
      id="ai-showcase"
      className="py-20 px-6 pastel:bg-gradient-to-br pastel:from-purple-50 pastel:to-pink-50 dark:bg-gradient-to-br dark:from-gray-900 dark:to-blue-900 girly-blue:bg-gradient-to-br girly-blue:from-blue-50 girly-blue:to-indigo-50"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-sora font-bold mb-6">AI & Machine Learning</h2>
          <p className="text-xl text-opacity-80 max-w-3xl mx-auto">
            Cutting-edge artificial intelligence solutions that transform data into insights, automate complex
            processes, and enhance user experiences through intelligent systems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {aiProjects.map((project, index) => (
            <div
              key={project.title}
              className="group glass-card rounded-2xl p-8 hover:scale-105 transition-all duration-500 animate-float"
              style={{ animationDelay: `${index * 0.5}s` }}
            >
              <div className="flex items-start gap-6">
                <div className="p-4 rounded-2xl pastel:bg-gradient-to-br pastel:from-purple-400 pastel:to-pink-400 dark:bg-gradient-to-br dark:from-blue-500 dark:to-purple-500 girly-blue:bg-gradient-to-br girly-blue:from-blue-400 girly-blue:to-indigo-400 group-hover:animate-glow">
                  <project.icon className="w-8 h-8 text-white" />
                </div>

                <div className="flex-1">
                  <h3 className="text-2xl font-sora font-bold mb-4">{project.title}</h3>
                  <p className="text-opacity-80 mb-6 leading-relaxed">{project.description}</p>

                  <div className="space-y-2 mb-6">
                    {project.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full pastel:bg-purple-400 dark:bg-blue-400 girly-blue:bg-blue-400" />
                        <span className="text-sm text-opacity-70">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <a
                    href={project.demoUrl}
                    className="inline-flex items-center gap-2 px-6 py-3 glass-card rounded-full hover:scale-105 transition-all duration-300 group-hover:shadow-lg"
                  >
                    Experience Demo
                    <Sparkles className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="glass-card rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-sora font-bold mb-4">AI Integration Expertise</h3>
            <p className="text-opacity-80 mb-6">
              Specialized in integrating AI capabilities into web applications using modern frameworks and cloud
              services. From OpenAI API implementations to custom TensorFlow.js models.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {["TensorFlow.js", "OpenAI API", "Hugging Face", "AWS SageMaker", "Google AI", "Custom Models"].map(
                (tech) => (
                  <span key={tech} className="px-4 py-2 glass-card rounded-full text-sm font-medium">
                    {tech}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Conditional OpenAI import to avoid errors when API key is missing
let openai: any = null;

const initializeOpenAI = () => {
  if (!openai && process.env.OPENAI_API_KEY) {
    try {
      const OpenAI = require('openai');
      openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    } catch (error) {
      console.log('OpenAI not available, using mock responses');
    }
  }
  return openai;
};

/**
 * Get AI recommendations for suppliers
 * @param userPreferences User preferences and requirements
 * @returns AI-generated supplier recommendations
 */
export const getSupplierRecommendations = async (userPreferences: {
  userId: string;
  location: string;
  requirements: string;
  budget?: string;
  pastOrders?: any[];
}): Promise<string> => {
  try {
    const openaiClient = initializeOpenAI();
    if (!openaiClient) {
      // Return mock recommendations if OpenAI is not available
      return JSON.stringify({
        suppliers: [
          {
            name: "Local Fresh Produce Co.",
            category: "Vegetables & Fruits",
            reasoning: "Recommended based on location proximity and positive reviews",
            estimatedDistance: "2-5 km",
            priceRange: "Budget-friendly"
          },
          {
            name: "Premium Suppliers Ltd.",
            category: "Organic Products",
            reasoning: "High-quality organic products with verified certifications",
            estimatedDistance: "5-10 km",
            priceRange: "Premium"
          }
        ]
      });
    }

    const prompt = `
      As an AI assistant for a B2B supplier discovery platform, suggest 3-5 suppliers based on the following criteria:
      
      Location: ${userPreferences.location}
      Requirements: ${userPreferences.requirements}
      Budget: ${userPreferences.budget || 'Not specified'}
      
      Please provide recommendations in the following JSON format:
      {
        "suppliers": [
          {
            "name": "Supplier Name",
            "category": "Category",
            "reasoning": "Why this supplier is recommended",
            "estimatedDistance": "Distance from location",
            "priceRange": "Budget-friendly/Mid-range/Premium"
          }
        ]
      }
      
      Focus on practical, business-relevant suggestions that would help a B2B buyer make informed decisions.
    `;

    const completion = await openaiClient.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 500,
    });

    return completion.choices[0]?.message?.content || 'No recommendations available';
  } catch (error) {
    console.error('OpenAI API error:', error);
    return JSON.stringify({
      suppliers: [
        {
          name: "Local Fresh Produce Co.",
          category: "Vegetables & Fruits",
          reasoning: "Recommended based on location proximity and positive reviews",
          estimatedDistance: "2-5 km",
          priceRange: "Budget-friendly"
        },
        {
          name: "Premium Suppliers Ltd.",
          category: "Organic Products",
          reasoning: "High-quality organic products with verified certifications",
          estimatedDistance: "5-10 km",
          priceRange: "Premium"
        }
      ]
    });
  }
};

/**
 * Predict demand for a product
 * @param productName Name of the product
 * @param location Location for demand prediction
 * @param month Month for prediction
 * @returns Predicted demand information
 */
export const predictDemand = async (
  productName: string,
  location: string,
  month: string
): Promise<any> => {
  try {
    const openaiClient = initializeOpenAI();
    if (!openaiClient) {
      // Return mock prediction if OpenAI is not available
      return {
        product: productName,
        location,
        month,
        predictedDemand: "Medium",
        demandVolume: "500-1000 kg",
        confidence: "Medium",
        factors: ["Seasonal demand", "Market trends"],
        recommendations: "Monitor local market conditions and adjust inventory accordingly"
      };
    }

    const prompt = `
      As an AI demand prediction system, analyze the demand for ${productName} in ${location} during ${month}.
      
      Consider factors like:
      - Seasonal variations
      - Local market trends
      - Weather patterns
      - Cultural events
      
      Provide your analysis in this JSON format:
      {
        "product": "${productName}",
        "location": "${location}",
        "month": "${month}",
        "predictedDemand": "High/Medium/Low",
        "demandVolume": "Estimated volume in kg/units",
        "confidence": "High/Medium/Low",
        "factors": ["Factor 1", "Factor 2", "Factor 3"],
        "recommendations": "Business recommendations for suppliers"
      }
    `;

    const completion = await openaiClient.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 400,
    });

    const response = completion.choices[0]?.message?.content || '';
    
    try {
      return JSON.parse(response);
    } catch (parseError) {
      return {
        product: productName,
        location,
        month,
        predictedDemand: "Medium",
        demandVolume: "500-1000 kg",
        confidence: "Medium",
        factors: ["Seasonal demand", "Market trends"],
        recommendations: "Monitor local market conditions and adjust inventory accordingly"
      };
    }
  } catch (error) {
    console.error('Demand prediction error:', error);
    return {
      product: productName,
      location,
      month,
      predictedDemand: "Medium",
      demandVolume: "500-1000 kg",
      confidence: "Low",
      factors: ["Limited data available"],
      recommendations: "Gather more historical data for better predictions"
    };
  }
};

/**
 * Generate product descriptions using AI
 * @param productName Product name
 * @param category Product category
 * @returns AI-generated product description
 */
export const generateProductDescription = async (
  productName: string,
  category: string
): Promise<string> => {
  try {
    const openaiClient = initializeOpenAI();
    if (!openaiClient) {
      // Return mock description if OpenAI is not available
      return `${productName} - Premium ${category} product with excellent quality and competitive pricing.`;
    }

    const prompt = `
      Write a professional, business-focused description for ${productName} in the ${category} category.
      The description should be suitable for a B2B supplier platform and include:
      - Key features and benefits
      - Quality indicators
      - Business applications
      - Keep it under 100 words
    `;

    const completion = await openaiClient.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
      max_tokens: 150,
    });

    return completion.choices[0]?.message?.content || 
      `${productName} - High-quality ${category} product suitable for business use.`;
  } catch (error) {
    console.error('Product description generation error:', error);
    return `${productName} - Premium ${category} product with excellent quality and competitive pricing.`;
  }
}; 
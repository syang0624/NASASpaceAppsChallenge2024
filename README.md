# NASASpaceAppsChallenge2024

## Project Demo

[https://youtu.be/X7NGAlDm5vQ](https://youtu.be/X7NGAlDm5vQ)

## Final Project

[https://syang0624.github.io/NASASpaceAppsChallenge2024/](https://syang0624.github.io/NASASpaceAppsChallenge2024/)

## Project Details

Our project, Back to the Present, is an interactive climate change game designed to educate and engage players on the consequences of human actions on the environment. The game takes the player on a journey through time, starting in the year 2000 and progressing toward 2024. At each stage, the player is given the ability to adjust three key parameters—number of trees planted, miles traveled, and energy consumption—all of which directly impact the global greenhouse gas (GHG) emissions.

The game incorporates real-world data for each of these parameters, which are fed into a model in the backend to determine the impact of the player’s choices on the climate. This model leverages TensorFlow, Keras, and Scikit-Learn to simulate how these actions affect the environment. The player is then presented with an emissions outcome, allowing them to see in real-time how their decisions shape the future.

What makes our project unique is the dynamic nature of the gameplay. We’ve integrated LLaMA 3.2 for text generation, allowing the descriptions and consequences for each decision to be unique based on the player’s input. This adds an extra layer of immersion, making the game feel more personal and engaging. The visual elements, including the background art and icons, were generated using ChatGPT for creative guidance, giving the game a cohesive look while highlighting key environmental issues.

The primary goal of Back to the Present is to make the complexities of climate change more accessible and fun. We hope that through interactive gameplay, players will not only learn about the urgency of climate action but also feel empowered to make changes that could lead to a brighter, more sustainable future.

We used a combination of technologies and tools to develop the game:

-   Frontend: Built using React, Vite, JavaScript, HTML, and CSS.
-   Backend: Powered by FastAPI with machine learning models using Python, TensorFlow, Keras, and Scikit-Learn.
-   Text generation: Integrated LLaMA 3.2 for dynamic and personalized content at every stage of the game.
-   Graphics: Assisted by ChatGPT for generating custom visuals, ensuring consistency and aesthetic appeal throughout the game.

Overall, our project is designed to be educational, engaging, and empowering. We hope that players walk away with a deeper understanding of the climate crisis and a sense of agency to enact meaningful change.

## Use of Artificial Intelligence

Yes, we utilized several Artificial Intelligence (AI) tools and software in the development of our project, Back to the Present. These tools enhanced the game’s interactivity, realism, and dynamic content generation.

1. LLaMA 3.2 for Text Generation:We integrated LLaMA 3.2 to dynamically generate text based on the player’s decisions at each stage of the game. This allows for personalized and contextually relevant descriptions of how the player’s choices (such as planting trees or reducing miles traveled) impact the environment. The AI-generated text adds a layer of immersion by making the game feel responsive to individual actions, which is key to helping players understand the nuances of climate change.
2. ChatGPT for Image Generation:We used ChatGPT to guide the generation of the visual elements within the game, including backgrounds, icons, and other assets. ChatGPT helped create consistent, engaging visuals that complement the educational and interactive aspects of the game. The AI-assisted image generation contributed to the design of icons for parameters such as trees planted, miles traveled, and energy consumption, all of which are core components of the game.

These AI tools helped us create a more engaging and dynamic experience for players, allowing the game to offer unique interactions and visuals that respond to the player’s inputs.

## Space Agency Data

-   [Global CO₂ Emissions: "ODIAC Fossil Fuel CO₂ Emissions:" - odiac-ffco2-monthgrid-v2023](https://earth.gov/ghgcenter/data-catalog/odiac-ffco2-monthgrid-v2023)

## References

-   [Greenhouse Gas Inventory Data Explorer | US EPA. (2023). Epa.gov.](https://cfpub.epa.gov/ghgdata/inventoryexplorer/#transportation/select/select/select/all)
-   [Climate Change 2023: Synthesis Report. Contribution of Working Groups I, II and III to the Sixth Assessment Report of the Intergovernmental Panel on Climate Change.](https://www.ipcc.ch/report/ar6/syr/)
-   [Team SBN GitHub Repository](https://github.com/syang0624/NASASpaceAppsChallenge2024)
-   [Dataset Creation of US States Statistics from ODIAC](https://github.com/syang0624/NASASpaceAppsChallenge2024/blob/main/data/Dataset_Building.ipynb)
-   [Building Dataset for Modeling](https://github.com/syang0624/NASASpaceAppsChallenge2024/blob/main/data/Models/Dataset%20Building.ipynb)
-   [SBN Slide Presentation](https://docs.google.com/presentation/d/1Ycu5LxWfhFnAJdnxzjmN74ZOqOLYcS_2KNj5E3O1Hks/edit?usp=sharing)

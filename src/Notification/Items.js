export const SliderData = [
    {
        id: 0,
        index:0,
        text: 'Hello! The fresh scent of cheese has caught the attention of a wondering mouse. Watch as he attempts to find the cheese.',
        class: 'intro-slide'
    },


    {
        id: 1,
        index:1,
        text: "The grid explained -> Each cell has a 'weight' or a cost of 1. Meaning that getting to the next cell costs 1 unit. Of the four search algorithms presented, two are weighted and two are unweighted. The weighted search algorithms use the cells' weights to search for the endpoint. The unweighted search algorithms do not use the cells' weights and instead search neighboring cells until the endpoint is found (if possible)",
        class: 'about-slide'
    },



    {
        id: 2,
        index:2,
        text: 'Create obstacles! Click on cells to add walls or use the "Create Maze" button to generate walls in a maze pattern.',
        class: 'text-box'
    },
    {
        id: 3,
        index: 3,
        text: "Make it more challenging! Hold 'w' key while clicking on cells to add cats. The cats make the path more treacherous and have a weight of 10.",
        class: 'text-box'
    },

    {
        id: 4,
        index: 4,
        text: 'Drag Mouse and Cheese to fix start and end points.',
        class: 'text-box'
    },
    {
        id: 5, 
        index: 5,
        text: 'The algorithm buttons are located on the top left hand corner. Click right arrow to learn about them!',
        class: 'text-box'
    },




    {
        id: 6,
        index: 6,
        text: 'AStar Search -> This search algorithm is weighted and keeps track of the endpoint. Guarantees the shortest path!',
        class: 'astar-slide' 
    },
    {
        id: 7,
        index: 7,
        text: "Dijkstra's Algorithm -> This search algorithm is weighted and keeps track of the shortest distances to the start. Guarantees the shortest path!",
        class: 'dijkstra-slide'

    },
    {
        id: 8,
        index: 8,
        text: 'BFS (Breadth-First) Search -> This search algorithm is unweighted. Searches in a predefined manner. Guarantees the shortest path! (weights (cats) are removed from grid)',
        class: 'bfs-slide'

    },
    {
        id: 9,
        index: 9,
        text: 'DFS (Depth First) Search -> This search algorithm is unweighted. Searches in a predefined manner. DOES NOT guarantee the shortest path! (weights (cats) are removed from grid)',
        class: 'dfs-slide'

    },



    {
        id: 10,
        index: 10,
        text: 'After the search is completed, drag start and end points to find new paths. Click on different algorithms to compare paths.',
        class: 'text-box'
    },
    {
        id: 11,
        index: 11, 
        text: 'The animated colored cells in the grid represent the search area. The yellow cells represent the shortest path the mouse took to get to the cheese.',
        class: 'text-box'
    },
    {
        id: 12,
        index: 12,
        text: 'Reset board to add walls.',
        class: 'text-box'
    },
    {
        id: 13,
        index: 13,
        text: 'Enjoy!',
        class: 'text-box'
    }
]
<!-- [MermaidChart: 9178c3cc-4f5b-4a70-86a5-ab7e834a7c32] -->
:::mermaid
graph TB;
    APP(APP.vue)
    subgraph Router Views
        E403[403]
        E404[404]
        E500[500]
        Login[Login]
        Main[Main]
        NavBar[Navigation Bar]
        User[user]
        subgraph Router Views
            Home[Home]
            Test[Test]
                SideMenu[SideMenu]
                    Button[Button]
                    Score[Score]
                    Timer[Timer]
                subgraph Router Views
                    Detail[Detail]
                    History[History]
                    Question[Question]
                        QuestionCard[QuestionCard]
                end
            Practice[Practice]
            Analyze[Analyze]
            Manage[Manage]
            Class[Class]
            UserDash[User Dashboard]
            Setting[Settings]
        end
    end
    APP --- E403
    APP --- E404
    APP --- E500
    APP --- Main
    APP --- Login
    Main --- NavBar
    Main --- User
    Main --- Home
    Main --- Test
    Main --- Practice
    Main --- Analyze
    Main --- Manage
    Main --- Class
    Main --- UserDash
    Main --- Setting
    Test --- SideMenu
    Test --- Detail
    Test --- History
    Test --- Question
    SideMenu --- Button
    SideMenu --- Score
    SideMenu --- Timer
    Question --- QuestionCard
:::
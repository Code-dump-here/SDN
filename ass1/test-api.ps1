# Simple Quiz API Test Script
Write-Host "=== Testing Simple Quiz API ===" -ForegroundColor Cyan

$baseUrl = "http://localhost:3000"

# Test 1: Get API Info
Write-Host "`n1. Getting API Info..." -ForegroundColor Yellow
Invoke-RestMethod -Uri "$baseUrl/" -Method GET | ConvertTo-Json

# Test 2: Create a Quiz
Write-Host "`n2. Creating a Quiz..." -ForegroundColor Yellow
$quizBody = @{
    title = "Geography Quiz"
    description = "Test your knowledge of world capitals"
} | ConvertTo-Json

$quiz = Invoke-RestMethod -Uri "$baseUrl/quizzes" -Method POST -Body $quizBody -ContentType "application/json"
$quizId = $quiz.data._id
Write-Host "Quiz created with ID: $quizId" -ForegroundColor Green
$quiz | ConvertTo-Json -Depth 10

# Test 3: Create Questions
Write-Host "`n3. Creating Questions..." -ForegroundColor Yellow

$question1 = @{
    text = "What is the capital of France?"
    options = @("London", "Paris", "Berlin", "Madrid")
    keywords = @("capital", "france", "europe")
    correctAnswerIndex = 1
} | ConvertTo-Json

$q1Result = Invoke-RestMethod -Uri "$baseUrl/questions" -Method POST -Body $question1 -ContentType "application/json"
Write-Host "Question 1 created!" -ForegroundColor Green

$question2 = @{
    text = "What is the capital of Japan?"
    options = @("Seoul", "Beijing", "Tokyo", "Bangkok")
    keywords = @("capital", "japan", "asia")
    correctAnswerIndex = 2
} | ConvertTo-Json

$q2Result = Invoke-RestMethod -Uri "$baseUrl/questions" -Method POST -Body $question2 -ContentType "application/json"
Write-Host "Question 2 created!" -ForegroundColor Green

# Test 4: Add question directly to quiz
Write-Host "`n4. Adding question to quiz..." -ForegroundColor Yellow
$question3 = @{
    text = "What is the capital of Italy?"
    options = @("Rome", "Milan", "Venice", "Florence")
    keywords = @("capital", "italy", "europe")
    correctAnswerIndex = 0
} | ConvertTo-Json

$addResult = Invoke-RestMethod -Uri "$baseUrl/quizzes/$quizId/question" -Method POST -Body $question3 -ContentType "application/json"
Write-Host "Question added to quiz!" -ForegroundColor Green

# Test 5: Add multiple questions to quiz
Write-Host "`n5. Adding multiple questions to quiz..." -ForegroundColor Yellow
$multipleQuestions = @{
    questions = @(
        @{
            text = "What is the capital of Germany?"
            options = @("Munich", "Hamburg", "Berlin", "Frankfurt")
            keywords = @("capital", "germany", "europe")
            correctAnswerIndex = 2
        },
        @{
            text = "What is the capital of Spain?"
            options = @("Barcelona", "Madrid", "Seville", "Valencia")
            keywords = @("capital", "spain", "europe")
            correctAnswerIndex = 1
        }
    )
} | ConvertTo-Json -Depth 10

$multiResult = Invoke-RestMethod -Uri "$baseUrl/quizzes/$quizId/questions" -Method POST -Body $multipleQuestions -ContentType "application/json"
Write-Host "Multiple questions added!" -ForegroundColor Green

# Test 6: Get all quizzes with populated questions
Write-Host "`n6. Getting all quizzes with questions..." -ForegroundColor Yellow
$allQuizzes = Invoke-RestMethod -Uri "$baseUrl/quizzes" -Method GET
$allQuizzes | ConvertTo-Json -Depth 10

# Test 7: Get quiz with "capital" keyword questions
Write-Host "`n7. Getting quiz with 'capital' keyword questions..." -ForegroundColor Yellow
$capitalQuiz = Invoke-RestMethod -Uri "$baseUrl/quizzes/$quizId/populate" -Method GET
$capitalQuiz | ConvertTo-Json -Depth 10

# Test 8: Get all questions
Write-Host "`n8. Getting all questions..." -ForegroundColor Yellow
$allQuestions = Invoke-RestMethod -Uri "$baseUrl/questions" -Method GET
Write-Host "Total questions: $($allQuestions.count)" -ForegroundColor Green

Write-Host "`n=== Tests Completed! ===" -ForegroundColor Cyan
Write-Host "Check MongoDB Compass to see your data in the SimpleQuiz database" -ForegroundColor Green

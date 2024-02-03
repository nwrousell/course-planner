from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from bs4 import BeautifulSoup
from selenium.webdriver.support.ui import Select
import codecs
import re
from webdriver_manager.chrome import ChromeDriverManager
import time 

## OPTIONS
department_value = "COMP"

## Open cab.brown.edu
driver=webdriver.Chrome(service=Service(ChromeDriverManager().install()))
url = "https://cab.brown.edu/"

wait = WebDriverWait(driver, 10) # max 10 second timeout
print("Done waiting")
driver.get(url)
get_url = driver.current_url
print("got URL:", get_url)
wait.until(EC.url_to_be(url)) # ! THIS LINE
if get_url == url:
    page_source = driver.page_source

print("URL is Correct: ", get_url)
soup = BeautifulSoup(page_source, features="html.parser")
print("title: ", soup.title.text)

## Select "Computer Science" under "Advanced Search"
dropdown = driver.find_element(By.ID, 'crit-dept')
select = Select(dropdown)
select.select_by_value(department_value)

## Select "Any Term (2023-2024)" in the first dropdown
dropdown = driver.find_element(By.ID, 'crit-srcdb')
select = Select(dropdown)
select.select_by_value("999999") # '999999' is the option value for 'Any Term (2023-2024)'

## Click "Find Courses"
button = driver.find_element(By.ID, 'search-button')
button.click()


# For each course
results = driver.find_elements(By.CLASS_NAME, 'result')
print(len(results), "Results")

for result in results:
    #  Click on course
    result.click()
    wait.until(EC.presence_of_element_located(By.CLASS_NAME, "dtl-course-code"))

    non_clickable_section = driver.find_elements(By.CLASS_NAME, "dtl-section")
    if len(non_clickable_section) == 0:
        #  Click S01
        section_01 = driver.find_element(By.CLASS_NAME, "course-section course-section--matched")
        section_01.click()
        wait.until(EC.presence_of_element_located(By.CLASS_NAME, "dtl-section"))
    
    


#  -> Grab course code
#  -> Grab title
#  -> Grab description
#  -> Grab critical review link
#  -> Grab instructor
#  -> Add prereqs (split)

# Write to JSON

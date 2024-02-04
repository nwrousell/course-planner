import json

fnames = ["COMP_courses.json", "APMA_courses.json", "ECON_courses.json","MATH_courses.json"]

COURSES = []

for fname in fnames:
    with open(fname, "r") as infile:
        data = json.load(infile)
        COURSES = COURSES + data

NEW_COURSES = {}
for course in COURSES:
    code = course["code"]
    NEW_COURSES[code] = course

# Write to JSON
json_object = json.dumps(NEW_COURSES, indent=4)
 
# Writing to sample.json
with open("all_courses.json", "w") as outfile:
    outfile.write(json_object)
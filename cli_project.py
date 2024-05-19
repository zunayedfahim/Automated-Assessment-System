#!/usr/bin/env python

def get_all_files(directory_path):
    import os

    try:
        # List all files and directories in the specified directory_path
        all_items = os.listdir(directory_path)
        # Filter out only the files
        files = [f for f in all_items if os.path.isfile(os.path.join(directory_path, f))]
        return files
    except FileNotFoundError:
        print(f"The directory_path {directory_path} does not exist.")
        return []

def createAssessment(assessment_name, rubric_sheet_link, student_sheet_link, directory_path):
    import requests 

    files = get_all_files(directory_path)

    url = "http://localhost:5000/createAssessment"
    payload = {
        "assessmentName": assessment_name,
        "email": "fahimzunayed@gmail.com",
        "deadline": "2024-02-29 15:42:06", 
        "googleSheet1": student_sheet_link, 
        "googleSheet2": rubric_sheet_link,
        "pdf": files
    }
    headers = {
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()  # Raises an HTTPError for bad responses (4xx and 5xx)
        data = response.json()  # Assuming the response is in JSON format
        return data
    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")
        return None


def main():
    import sys
    
    if len(sys.argv) != 5:
        print("Usage: ./cli_project {assessment_name} {rubric_sheet_link} {student_sheet_link} {path to directory containing files for RAG}")
        sys.exit(1)

    assessment_name = sys.argv[1]
    rubric_sheet_link = sys.argv[2]
    student_sheet_link = sys.argv[3]
    directory_path = sys.argv[4]

    # Placeholder for processing the files and generating a grading sheet link
    grading_sheet_link = f"https://example.com/grading_sheet/{assessment_name}"


    

    # print(f"Grading sheet link: {grading_sheet_link}")

if __name__ == '__main__':
    main()
    
    


# Input: ./cli_project.py "Math 1" "https://docs.google.com/spreadsheets/d/1K_TleWr3lIN2AxodRGd_jxF748oqPfxp_bSpONQ2u9U/edit#gid=0" "https://docs.google.com/spreadsheets/d/18l3z_n03uKZgIU0pcNv-9mjm-ErwPCqLbgzcn1DtOvw/edit#gid=0" "D:\Programming\Projects\Automated-Assessment-System\backend\pdfFiles"
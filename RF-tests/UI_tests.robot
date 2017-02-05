*** Settings ***
Library           OperatingSystem
Library           FakerLibrary
Library           Selenium2Library    15
Library           ImageHorizonLibrary
Library           Process
Library           ${CURDIR}${/}common.py

*** Variables ***
#${URL}=    http://localhost:8100/
${URL}=    http://solita.then.fi/ionic2/
${TIME_TO_WAIT}=    3

*** Test Cases ***
# for some reason test has to wait before clicking elements even though elements are visible

# UI
Login
    [Tags]  Login
    # no good way to start ionic2 server from RF, server takes time to start
    # so make sure that server is running before tests
    # Setup and Check Environment
    Open Browser    ${URL}     	ff
    Maximize Browser Window
    Wait Until Element Is Enabled    login
    click element    login

Select Case 1
    [Tags]  Test1
    Wait Until Page Contains    Valitse lupa-asia
    # some reason has to wait before clicking even though elements are visible
    sleep    ${TIME_TO_WAIT}
    click element    start_case_1
    sleep    ${TIME_TO_WAIT}

Verification by email
    [Tags]  Test1
    Wait Until Element Is Enabled    emailButton
    click element    emailButton
    Wait Until Element Is Enabled    firstNameInput
    # fill information
    click element   firstNameInput
    Type    Key.TAB    Key.TAB    Key.TAB
    ${fname}=    First Name
    Type    ${fname}
    Type    Key.TAB
    ${lname}=    Last Name
    Type    ${lname}
    Type    Key.TAB
    ${address}=    Address
    Type    ${address}
    Type    Key.TAB
    type_emailaddress    rf-tester    example.com
    click element    sendButton
    Wait Until Page Contains    Kuuleminen tallennettu Lupapisteeseen


Select Case 1 Info
    [Tags]  Test2
    Wait Until Page Contains    Valitse lupa-asia
    sleep    ${TIME_TO_WAIT}
    click element    info_case_1
    sleep    ${TIME_TO_WAIT}

Move to Presenting Information
    [Tags]  Test2
    Wait Until Element Is Enabled    presentButton
    sleep    ${TIME_TO_WAIT}
    click element    presentButton
    sleep    ${TIME_TO_WAIT}

Move to Verification Selection
    [Tags]  Test2
    Wait Until Element Is Enabled    continueButton
    # fill information
    click element   continueButton

Fill Verification Information and Select Verification Type
    [Tags]  Test2
    Wait Until Element Is Enabled    firstNameInput
    click element   firstNameInput
    Type    Key.TAB    Key.TAB    Key.TAB
    ${fname}=    First Name
    Type    ${fname}
    Type    Key.TAB
    ${lname}=    Last Name
    Type    ${lname}
    Type    Key.TAB
    ${address}=    Address
    Type    ${address}
    click element   signatureButton

Draw a Signature and Send
    [Tags]  Test2
    sleep    ${TIME_TO_WAIT}
    draw_signature
    click element   sendButton

*** Keywords ***
Setup and Check Environment
    # chromedriver
    # Set Environment Variable    webdriver.chrome.driver    ${CURDIR}${/}bin${/}chromedriver.exe
    # Append To Environment Variable 	PATH 	${CURDIR}${/}bin
    # start ionic2 if not running
    ${result}=   running    node.exe
    Log    ${result}
    Run keyword if    ${result}==False    Start Ionic2

Start Ionic2
    # is ionic serve running
    Start process     ${CURDIR}${/}start_ionic2.bat    alias=ionic2
    ${process_id}=    Get Process Id
    Wait for process    ${process_id)
    LOG  ${process_id}

CREATE TABLE campus_data(
    id INTEGER PRIMARY KEY,
    campus_id VARCHAR(100) UNIQUE NOT NULL,
    campus_name VARCHAR(100) NOT NULL,
    isActive BOOLEAN NOT NULL,
    joinedWhen TIMESTAMP
);


CREATE TABLE reader_data(
    id INTEGER PRIMARY KEY,
    reader_id VARCHAR(100) UNIQUE NOT NULL,
    campus_id VARCHAR(100) NOT NULL,
    reader_name VARCHAR(100) NOT NULL,
    reader_type ENUM('QR', 'NFC', 'QR+NFC')
    service_type ENUM('Payment', 'Access', 'EventRollCall', 'Attendance') NOT NULL,
    designation VARCHAR(100) NOT NULL,
    createdAt TIMESTAMP,
    FOREIGN KEY (campus_id) REFERENCES campus_data(campus_id)
);


CREATE TABLE location_data(
    id INTEGER PRIMARY KEY,
    varchar_id VARCHAR(100) NOT NULL,
    Address TEXT NOT NULL,
    longitude DOUBLE NOT NULL,
    latitude DOUBLE NOT NULL,
    createdAt TIMESTAMP
);


CREATE TABLE students_data(
    id INTEGER PRIMARY KEY,
    campus_id VARCHAR(100) NOT NULL,
    student_id VARCHAR(100) UNIQUE NOT NULL,
    isActive BOOLEAN NOT NULL,
    nfc_status VARCHAR(100) NOT NULL,
    account_status VARCHAR(100) NOT NULL,
    onBoardedWhen TIMESTAMP,
    FOREIGN KEY (campus_id) REFERENCES campus_data(campus_id)
);


CREATE TABLE students_credentials(
    id INTEGER PRIMARY KEY,
    student_id VARCHAR(100) NOT NULL,
    student_name VARCHAR(150) NOT NULL,
    admission_number VARCHAR(100) NOT NULL,
    student_course VARCHAR(100) NOT NULL,
    createdAt TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students_data(student_id)
);


CREATE TABLE campus_credentials(
    id INTEGER PRIMARY KEY,
    campus_id VARCHAR(100) NOT NULL,
    security_token VARCHAR(200) NOT NULL,
    verified BOOLEAN NOT NULL,
    createdAt TIMESTAMP,
    FOREIGN KEY (campus_id) REFERENCES campus_data(campus_id)
);


CREATE TABLE service_data(
    id INTEGER PRIMARY KEY,
    service_id VARCHAR(100) UNIQUE NOT NULL,
    reader_id VARCHAR(100) NOT NULL,
    Designation_name VARCHAR(100) NOT NULL,
    createdAt TIMESTAMP,
    FOREIGN KEY (reader_id) REFERENCES reader_data(reader_id)
);


CREATE TABLE service_sessions(
    id INTEGER PRIMARY KEY,
    session_id VARCHAR(100) UNIQUE NOT NULL,
    service_id VARCHAR(100) NOT NULL,
    student_id VARCHAR(100) NOT NULL,
    nonce VARCHAR(100) NOT NULL,
    status VARCHAR(100) NOT NULL,
    reason VARCHAR(100) NOT NULL,
    createdAt TIMESTAMP,
    FOREIGN KEY (service_id) REFERENCES service_data(service_id),
    FOREIGN KEY (student_id) REFERENCES students_data(student_id)
);


CREATE TABLE transactions(
    id INTEGER PRIMARY KEY,
    student_id VARCHAR(100) NOT NULL,
    title VARCHAR(100) NOT NULL,
    amount INTEGER NOT NULL,
    category VARCHAR(100) NOT NULL,
    createdAt TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students_data(student_id)
);




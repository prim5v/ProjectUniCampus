-- ==========================================
-- ENUM TYPES
-- ==========================================

CREATE TYPE service_type_enum AS ENUM (
    'Payment', 'Access', 'EventRollCall', 'Attendance'
);

CREATE TYPE reader_type_enum AS ENUM (
    'QR', 'NFC', 'QR+NFC'
)



-- ==========================================
-- CAMPUS DATA
-- ==========================================

CREATE TABLE campus_data (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    campus_id VARCHAR(100) UNIQUE NOT NULL,
    campus_name VARCHAR(100) NOT NULL,
    isActive BOOLEAN NOT NULL,
    "joinedWhen" TIMESTAMP
);

-- ==========================================
-- READER DATA
-- ==========================================

CREATE TABLE reader_data (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    reader_id VARCHAR(100) UNIQUE NOT NULL,
    campus_id VARCHAR(100) NOT NULL,
    reader_name VARCHAR(100) NOT NULL,
    reader_type reader_type_enum NOT NULL,
    service_type service_type_enum NOT NULL,
    designation VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP,

    CONSTRAINT fk_reader_campus
        FOREIGN KEY (campus_id)
        REFERENCES campus_data(campus_id)
);

-- ==========================================
-- LOCATION DATA
-- ==========================================

CREATE TABLE location_data (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    varchar_id VARCHAR(100) NOT NULL,
    Address TEXT NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP
);

-- ==========================================
-- STUDENTS DATA
-- ==========================================

CREATE TABLE students_data (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    campus_id VARCHAR(100) NOT NULL,
    student_id VARCHAR(100) UNIQUE NOT NULL,
    isActive BOOLEAN NOT NULL,
    nfc_status VARCHAR(100) NOT NULL,
    account_status VARCHAR(100) NOT NULL,
    "onBoardedWhen" TIMESTAMP,

    CONSTRAINT fk_students_campus
        FOREIGN KEY (campus_id)
        REFERENCES campus_data(campus_id)
);

-- ==========================================
-- STUDENT CREDENTIALS
-- ==========================================

CREATE TABLE students_credentials (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    student_id VARCHAR(100) NOT NULL,
    student_name VARCHAR(150) NOT NULL,
    admission_number VARCHAR(100) NOT NULL,
    student_course VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP,

    CONSTRAINT fk_student_credentials
        FOREIGN KEY (student_id)
        REFERENCES students_data(student_id)
);

-- ==========================================
-- CAMPUS CREDENTIALS
-- ==========================================

CREATE TABLE campus_credentials (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    campus_id VARCHAR(100) NOT NULL,
    security_token VARCHAR(200) NOT NULL,
    verified BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP,

    CONSTRAINT fk_campus_credentials
        FOREIGN KEY (campus_id)
        REFERENCES campus_data(campus_id)
);

-- ==========================================
-- SERVICE DATA
-- ==========================================

CREATE TABLE service_data (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    service_id VARCHAR(100) UNIQUE NOT NULL,
    reader_id VARCHAR(100) NOT NULL,
    Designation_name VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP,

    CONSTRAINT fk_service_reader
        FOREIGN KEY (reader_id)
        REFERENCES reader_data(reader_id)
);

-- ==========================================
-- SERVICE SESSIONS
-- ==========================================

CREATE TABLE service_sessions (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    session_id VARCHAR(100) UNIQUE NOT NULL,
    service_id VARCHAR(100) NOT NULL,
    student_id VARCHAR(100) NOT NULL,
    nonce VARCHAR(100) NOT NULL,
    status VARCHAR(100) NOT NULL,
    reason VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP,

    CONSTRAINT fk_session_service
        FOREIGN KEY (service_id)
        REFERENCES service_data(service_id),

    CONSTRAINT fk_session_student
        FOREIGN KEY (student_id)
        REFERENCES students_data(student_id)
);

-- ==========================================
-- TRANSACTIONS
-- ==========================================

CREATE TABLE transactions (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    student_id VARCHAR(100) NOT NULL,
    title VARCHAR(100) NOT NULL,
    amount INTEGER NOT NULL,
    category VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP,

    CONSTRAINT fk_transaction_student
        FOREIGN KEY (student_id)
        REFERENCES students_data(student_id)
);
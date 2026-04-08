import React, { useState, useMemo } from 'react';
import './App.css';
import developerImage from './edited-image.jpg';
import { 
  Calendar, 
  Search, 
  BookOpen, 
  Layers, 
  X, 
  ShieldCheck, 
  Code2,
  ExternalLink,
  GraduationCap
} from 'lucide-react';

/**
 * SHUT UP AND TAKE COURSE v2.7 FINAL
 * Developer: Abdullah Al Fahim
 * Repository: https://github.com/abdullah-alfahim/Shut-up-and-the-Course-
 */

const DAYS = ['SAT', 'SUN', 'MON', 'TUE', 'WED'];
const SLOTS = [
  { label: '8:30 AM - 10:00 AM', key: 'S1' },
  { label: '10:00 AM - 11:30 AM', key: 'S2' },
  { label: '11:30 AM - 1:00 PM', key: 'S3' },
  { label: 'BREAK', key: 'BR' },
  { label: '1:30 PM - 3:00 PM', key: 'S4' },
  { label: '3:00 PM - 4:30 PM', key: 'S5' }
];

const COLORS = [
  '#E6F1FB:#0C447C', '#EAF3DE:#27500A', '#FAEEDA:#633806', '#FBEAF0:#72243E',
  '#E1F5EE:#085041', '#EEEDFE:#3C3489', '#FAECE7:#712B13', '#F1EFE8:#444441'
];

const COURSES = {
  260: [{ code: 'ESP 009', name: 'Academic English', credit: 0, sections: ['D1', 'D2', 'D3', 'D4'] }, { code: 'MAT 009', name: 'Remedial Math', credit: 0, sections: ['D1'] }, { code: 'MAT 101', name: 'Calculus for Computing', credit: 3, sections: ['D1', 'D2', 'D3', 'D4', 'D5'] }, { code: 'PHY 101', name: 'Physics I', credit: 3, sections: ['D1', 'D2', 'D3', 'D4'] }, { code: 'CSE 100', name: 'Computational Thinking', credit: 1.5, sections: ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9'] }, { code: 'CSE 101', name: 'Discrete Mathematics', credit: 3, sections: ['D1', 'D2', 'D3', 'D4', 'D5'] }],
  261: [{ code: 'ESP 101', name: 'Academic English I', credit: 3, sections: ['D1', 'D2', 'D3'] }, { code: 'CHE 101', name: 'Chemistry', credit: 3, sections: ['D1', 'D2', 'D3'] }, { code: 'CHE 102', name: 'Chemistry Lab', credit: 1, sections: ['D1', 'D2', 'D3', 'D4', 'D5', 'D6'] }, { code: 'CSE 103', name: 'Structured Programming', credit: 3, sections: ['D1', 'D2', 'D3', 'D4', 'D5'] }, { code: 'CSE 104', name: 'Structured Programming Lab', credit: 1.5, sections: ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8'] }, { code: 'ESD 102', name: 'Communication & Self-Dev', credit: 0, sections: ['D1', 'D2', 'D3', 'D4', 'D5', 'D6'] }, { code: 'GED 103', name: 'Functional Bengali', credit: 2, sections: ['D1', 'D2', 'D3'] }],
  252: [{ code: 'MAT 103', name: 'Linear Algebra & Vector Analysis', credit: 3, sections: ['D1', 'D2', 'D3'] }, { code: 'PHY 103', name: 'Physics II', credit: 3, sections: ['D1', 'D2', 'D3'] }, { code: 'PHY 104', name: 'Physics Lab', credit: 1.5, sections: ['D1', 'D2', 'D3', 'D4', 'D5', 'D6'] }, { code: 'CSE 205', name: 'Data Structures', credit: 3, sections: ['D1', 'D2', 'D3', 'D4'] }, { code: 'CSE 206', name: 'Data Structures Lab', credit: 1.5, sections: ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7'] }],
  250: [{ code: 'CSE 201', name: 'Object Oriented Programming', credit: 3, sections: ['D1', 'D2', 'D3', 'D4'] }, { code: 'CSE 202', name: 'OOP Lab', credit: 1.5, sections: ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7'] }, { code: 'CSE 203', name: 'Digital Logic Design', credit: 3, sections: ['D1', 'D2', 'D3', 'D4'] }, { code: 'CSE 204', name: 'DLD Lab', credit: 1, sections: ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7'] }, { code: 'PHY 103', name: 'Physics II', credit: 3, sections: ['D1', 'D2', 'D3', 'D4'] }, { code: 'PHY 104', name: 'Physics Lab', credit: 1.5, sections: ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7'] }],
  251: [{ code: 'CSE 207', name: 'Algorithms', credit: 3, sections: ['D1', 'D2', 'D3', 'D4'] }, { code: 'CSE 208', name: 'Algorithms Lab', credit: 1.5, sections: ['D1', 'D2', 'D3', 'D4', 'D5', 'D6'] }, { code: 'MAT 201', name: 'Diff. Equations & Coord. Geometry', credit: 3, sections: ['D1', 'D2', 'D3'] }, { code: 'CSE 211', name: 'Computer Architecture', credit: 3, sections: ['D1', 'D2', 'D3', 'D4'] }, { code: 'GED 201', name: 'Financial & Managerial Accounting', credit: 3, sections: ['D1', 'D2', 'D3'] }],
  242: [{ code: 'CSE 301', name: 'Web Programming', credit: 3, sections: ['D1', 'D2', 'D3', 'D4'] }, { code: 'CSE 302', name: 'Web Programming Lab', credit: 1.5, sections: ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7'] }, { code: 'CSE 303', name: 'Microprocessors & Embedded Sys.', credit: 3, sections: ['D1', 'D2', 'D3', 'D4'] }, { code: 'CSE 304', name: 'Microprocessors Lab', credit: 1, sections: ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7'] }, { code: 'EEE 201', name: 'Electrical Devices & Circuits', credit: 3, sections: ['D1', 'D2', 'D3', 'D4'] }, { code: 'EEE 202', name: 'Electrical Devices Lab', credit: 1, sections: ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7'] }],
  241: [{ code: 'CSE 313', name: 'Software Engineering', credit: 3, sections: ['D1', 'D2', 'D3'] }, { code: 'GED 301', name: 'History of Bangladesh', credit: 2, sections: ['D1', 'D2'] }, { code: 'CSE 315', name: 'Artificial Intelligence', credit: 3, sections: ['D1', 'D2', 'D3'] }, { code: 'CSE 316', name: 'AI Lab', credit: 1.5, sections: ['D1', 'D2', 'D3', 'D4'] }, { code: 'CSE 317', name: 'Computer Networking', credit: 3, sections: ['D1', 'D2', 'D3'] }, { code: 'CSE 318', name: 'Networking Lab', credit: 1.5, sections: ['D1', 'D2', 'D3', 'D4'] }],
  232: [{ code: 'CSE 311', name: 'Data Communication', credit: 3, sections: ['D1', 'D2', 'D3'] }, { code: 'CSE 309', name: 'Compiler', credit: 3, sections: ['D4'] }, { code: 'CSE 312', name: 'Data Communication Lab', credit: 1, sections: ['D1', 'D2', 'D3', 'D4'] }, { code: 'CSE 310', name: 'Compiler Lab', credit: 1, sections: ['D1', 'D2'] }, { code: 'ESP 401', name: 'Professional English', credit: 2, sections: ['D1', 'D2', 'D3', 'D4'] }, { code: 'CSE 403', name: 'Machine Learning', credit: 3, sections: ['D1', 'D2', 'D3', 'D4', 'D5'] }, { code: 'CSE 404', name: 'ML Lab', credit: 1.5, sections: ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7'] }, { code: 'CSE 320', name: 'Design Project II', credit: 1.5, sections: ['D1', 'D2', 'D3', 'D4', 'D5', 'D6'] }],
  231: [{ code: 'CSE 323', name: 'Cryptography & Cybersecurity', credit: 3, sections: ['D1', 'D2'] }, { code: 'CSE 413', name: 'Natural Language Processing', credit: 3, sections: ['D1'] }, { code: 'CSE 425', name: 'Mobile App Development', credit: 3, sections: ['D1'] }, { code: 'CSE 414', name: 'NLP Lab', credit: 1, sections: ['D1', 'D2'] }, { code: 'CSE 426', name: 'Mobile App Dev Lab', credit: 1, sections: ['D1'] }, { code: 'GED 407', name: 'Professional Ethics', credit: 2, sections: ['D1', 'D2', 'D3'] }, { code: 'GED 403', name: 'Industrial & Ops Management', credit: 3, sections: ['D1', 'D2', 'D3'] }, { code: 'CSE 400B', name: 'Final Year Project/Thesis', credit: 2, sections: ['D1'] }],
  223: [{ code: 'CSE 400C', name: 'Capstone Project/Thesis', credit: 2, sections: ['D1'] }, { code: 'CSE 458', name: 'Industrial Training', credit: 3, sections: ['D1'] }, { code: 'CSE 435', name: 'Data Mining', credit: 3, sections: ['D1', 'D2'] }, { code: 'CSE 453', name: 'Software Testing & QA', credit: 3, sections: ['D1'] }, { code: 'CSE 436', name: 'Data Mining Lab', credit: 1, sections: ['D1', 'D2', 'D3', 'D4'] }, { code: 'CSE 454', name: 'SQA Lab', credit: 1, sections: ['D1', 'D2'] }, { code: 'PSD 400', name: 'Professional Life Skills Dev.', credit: 0, sections: ['D1', 'D2', 'D3'] }]
};

const SCH = {
  'ESP 009': { D1: { SAT: { S1: 'A605' }, MON: { S2: 'J105' }, TUE: { S2: 'A602' } }, D2: { SAT: { S1: 'A606' }, MON: { S2: 'A606' }, TUE: { S2: 'A603' } }, D3: { SAT: { S3: 'J101' }, MON: { S2: 'J106' }, TUE: { S2: 'A603' } }, D4: { SAT: { S3: 'J105' }, MON: { S2: 'A602' }, TUE: { S2: 'A602' } } },
  'MAT 009': { D1: { SAT: { S5: 'A605' }, TUE: { S5: 'A602' }, WED: { S5: 'A602' } } },
  'MAT 101': { D1: { SAT: { S3: 'K106' }, TUE: { S2: 'K106' }, WED: { S3: 'K106' } }, D2: { SAT: { S3: 'A606' }, TUE: { S2: 'A603' }, WED: { S3: 'A606' } }, D3: { SAT: { S4: 'J101' }, TUE: { S3: 'J101' }, WED: { S4: 'J101' } }, D4: { SAT: { S4: 'A603' }, TUE: { S3: 'J105' }, WED: { S4: 'J105' } }, D5: { TUE: { S4: 'A606' } } },
  'PHY 101': { D1: { SAT: { S1: 'K106' }, TUE: { S1: 'K106' }, WED: { S5: 'K106' } }, D2: { SAT: { S1: 'A606' }, TUE: { S1: 'A603' }, WED: { S5: 'A606' } }, D3: { SAT: { S3: 'J101' }, TUE: { S3: 'J101' }, WED: { S5: 'J101' } }, D4: { SAT: { S3: 'A603' }, TUE: { S4: 'J105' }, WED: { S5: 'J105' } } },
  'CSE 100': { D1: { SAT: { S3: 'A501' } }, D2: { SAT: { S3: 'A502' } }, D3: { SAT: { S5: 'A503' } }, D4: { SAT: { S5: 'A508' } }, D5: { SAT: { S5: 'J103' } }, D6: { SAT: { S1: 'A501' } }, D7: { SAT: { S1: 'A502' } }, D8: { SAT: { S1: 'A503' } }, D9: { SAT: { S1: 'A508' } } },
  'CSE 101': { D1: { SAT: { S2: 'A603' }, MON: { S1: 'J105' }, TUE: { S1: 'A605' } }, D2: { SAT: { S2: 'A602' }, MON: { S1: 'A602' }, TUE: { S1: 'A602' } }, D3: { SAT: { S5: 'J109' }, MON: { S2: 'J106' }, TUE: { S2: 'J106' } }, D4: { SAT: { S5: 'A606' }, MON: { S2: 'A602' }, TUE: { S2: 'A602' } }, D5: { SAT: { S2: 'A605' } } },
  'ESP 101': { D1: { SAT: { S1: 'J109' }, WED: { S3: 'J106' }, TUE: { S4: 'J106' } }, D2: { SAT: { S3: 'J106' }, WED: { S3: 'K106' }, TUE: { S4: 'J107' } }, D3: { SAT: { S3: 'J107' }, WED: { S3: 'K105' }, TUE: { S4: 'J109' } } },
  'CHE 101': { D1: { SAT: { S2: 'J109' }, WED: { S1: 'K103' }, TUE: { S3: 'J107' } }, D2: { SAT: { S5: 'J106' }, WED: { S3: 'J107' }, TUE: { S3: 'J106' } }, D3: { SAT: { S5: 'J107' }, WED: { S3: 'J109' }, TUE: { S3: 'J109' } } },
  'CHE 102': { D1: { MON: { S1: 'H109' }, TUE: { S1: 'H109' } }, D2: { MON: { S1: 'H111' }, TUE: { S1: 'H111' } }, D3: { MON: { S4: 'H109' } }, D4: { MON: { S4: 'H111' } }, D5: { WED: { S1: 'H109' } }, D6: { WED: { S1: 'H111' } } },
  'CSE 103': { D1: { SAT: { S3: 'J109' }, MON: { S2: 'J109' }, WED: { S3: 'J106' } }, D2: { SAT: { S3: 'A606' }, MON: { S2: 'J101' }, WED: { S4: 'J106' } }, D3: { SAT: { S3: 'L102' }, MON: { S2: 'J105' }, WED: { S4: 'J107' } }, D4: { SAT: { S4: 'J106' }, WED: { S4: 'J106' } }, D5: { WED: { S4: 'J107' } } },
  'CSE 104': { D1: { MON: { S1: 'K102' }, TUE: { S1: 'K102' } }, D2: { MON: { S1: 'J103' }, TUE: { S1: 'J103' } }, D3: { MON: { S1: 'K101' }, TUE: { S1: 'K101' } }, D4: { MON: { S1: 'J108' }, TUE: { S1: 'J108' } }, D5: { MON: { S1: 'K107' } }, D6: { MON: { S2: 'K101' } }, D7: { MON: { S2: 'A508' } }, D8: { MON: { S1: 'K109' } } },
  'ESD 102': { D1: { MON: { S4: 'A501' } }, D2: { MON: { S4: 'A502' } }, D3: { MON: { S4: 'A503' } }, D4: { MON: { S4: 'A508' } }, D5: { MON: { S4: 'J103' } }, D6: { MON: { S4: 'J108' } } },
  'GED 103': { D1: { SAT: { S5: 'J105' }, MON: { S2: 'K106' } }, D2: { SAT: { S1: 'J101' }, MON: { S2: 'L102' } }, D3: { SAT: { S1: 'L102' }, MON: { S2: 'J110' } } },
  'MAT 103': { D1: { SUN: { S1: 'J105' }, TUE: { S3: 'J105' }, WED: { S1: 'K112' } }, D2: { SUN: { S1: 'K103' }, TUE: { S2: 'K103' }, WED: { S1: 'K103' } }, D3: { SUN: { S2: 'K112' }, TUE: { S1: 'K112' }, WED: { S1: 'K112' } } },
  'PHY 103': { D1: { SUN: { S3: 'A603' }, TUE: { S1: 'K112' }, WED: { S2: 'A603' } }, D2: { SUN: { S3: 'A605' }, TUE: { S1: 'K103' }, WED: { S2: 'A605' } }, D3: { SUN: { S1: 'K112' }, TUE: { S3: 'J110' }, WED: { S1: 'J110' } } },
  'PHY 104': { D1: { SAT: { S1: 'A405' }, SUN: { S3: 'A405' }, WED: { S1: 'A405' } }, D2: { SAT: { S1: 'A407' }, SUN: { S3: 'A407' }, WED: { S1: 'A407' } }, D3: { SAT: { S5: 'A405' }, WED: { S3: 'A405' } }, D4: { SAT: { S5: 'A407' }, WED: { S3: 'A407' } }, D5: { MON: { S1: 'A405' } }, D6: { MON: { S1: 'A407' } } },
  'CSE 205': { D1: { SUN: { S2: 'K108' }, TUE: { S2: 'K108' }, WED: { S3: 'K108' } }, D2: { SUN: { S2: 'K103' }, TUE: { S2: 'K103' }, WED: { S3: 'K103' } }, D3: { SUN: { S3: 'K108' }, TUE: { S3: 'K108' } }, D4: { SUN: { S4: 'A602' }, TUE: { S4: 'A602' } } },
  'CSE 206': { D1: { SUN: { S4: 'A503' }, TUE: { S1: 'A503' } }, D2: { SUN: { S4: 'A508' }, TUE: { S1: 'A508' } }, D3: { SUN: { S4: 'J103' }, TUE: { S1: 'J103' } }, D4: { SUN: { S4: 'J108' }, TUE: { S1: 'J108' } }, D5: { TUE: { S3: 'J103' } }, D6: { TUE: { S3: 'J108' } }, D7: { TUE: { S3: 'K101' } } },
  'CSE 201': { D1: { SUN: { S2: 'J109' }, MON: { S2: 'J109' }, TUE: { S3: 'J109' } }, D2: { SUN: { S2: 'A603' }, MON: { S2: 'A603' }, TUE: { S3: 'A603' } }, D3: { MON: { S1: 'K106' }, TUE: { S3: 'J101' } }, D4: { MON: { S1: 'K103' }, TUE: { S4: 'J105' } } },
  'CSE 202': { D1: { SUN: { S3: 'K101' }, TUE: { S1: 'K101' } }, D2: { SUN: { S3: 'K102' }, TUE: { S1: 'K102' } }, D3: { SUN: { S3: 'K107' }, TUE: { S1: 'K107' } }, D4: { SUN: { S3: 'K109' }, TUE: { S1: 'K109' } }, D5: { SUN: { S1: 'J108' } }, D6: { SUN: { S1: 'K107' } }, D7: { SUN: { S1: 'K109' } } },
  'CSE 203': { D1: { SUN: { S1: 'J106' }, MON: { S2: 'J106' }, TUE: { S2: 'J106' } }, D2: { SUN: { S1: 'A603' }, MON: { S2: 'A603' }, TUE: { S2: 'A603' } }, D3: { SUN: { S2: 'J106' }, MON: { S2: 'J106' }, TUE: { S2: 'J106' } }, D4: { SUN: { S2: 'K103' }, MON: { S2: 'K105' }, TUE: { S2: 'K105' } } },
  'CSE 204': { D1: { SAT: { S5: 'A204' }, MON: { S2: 'A204' } }, D2: { SAT: { S5: 'G107' }, MON: { S2: 'G107' } }, D3: { SAT: { S1: 'A204' }, MON: { S3: 'A204' } }, D4: { SAT: { S1: 'G107' }, MON: { S3: 'G107' } }, D5: { MON: { S2: 'A607' } }, D6: { MON: { S2: 'G107' } }, D7: { MON: { S2: 'A204' } } },
  'CSE 207': { D1: { SUN: { S3: 'J107' }, TUE: { S4: 'J107' } }, D2: { SUN: { S4: 'A605' }, TUE: { S2: 'J107' } }, D3: { SUN: { S5: 'A606' }, TUE: { S3: 'J109' } }, D4: { TUE: { S4: 'J110' } } },
  'CSE 208': { D1: { WED: { S4: 'A501' } }, D2: { WED: { S4: 'A503' } }, D3: { WED: { S1: 'A501' } }, D4: { WED: { S1: 'A502' } }, D5: { WED: { S1: 'A503' } }, D6: { WED: { S1: 'A508' } } },
  'MAT 201': { D1: { SUN: { S2: 'J107' }, TUE: { S1: 'K112' }, WED: { S1: 'J101' } }, D2: { SUN: { S4: 'A605' }, TUE: { S3: 'J107' }, WED: { S2: 'J105' } }, D3: { SUN: { S5: 'A606' }, TUE: { S3: 'J109' }, WED: { S2: 'J106' } } },
  'CSE 211': { D1: { SUN: { S1: 'J106' }, TUE: { S1: 'J106' } }, D2: { SUN: { S3: 'J105' }, TUE: { S2: 'J110' } }, D3: { SUN: { S3: 'J110' }, TUE: { S2: 'J109' } }, D4: { SUN: { S1: 'K108' }, TUE: { S1: 'J110' } } },
  'GED 201': { D1: { SUN: { S5: 'K103' }, WED: { S2: 'J101' } }, D2: { SUN: { S2: 'J105' }, WED: { S2: 'J105' } }, D3: { SUN: { S2: 'J110' }, WED: { S2: 'J106' } } },
  'CSE 301': { D1: { SAT: { S1: 'A605' }, TUE: { S4: 'A605' }, SUN: { S5: 'A605' } }, D2: { SUN: { S5: 'A605' }, TUE: { S5: 'A605' } }, D3: { SAT: { S4: 'A602' }, TUE: { S3: 'A603' } }, D4: { SAT: { S4: 'A603' }, TUE: { S4: 'A605' } } },
  'CSE 302': { D1: { TUE: { S1: 'A501' } }, D2: { TUE: { S1: 'A502' } }, D3: { TUE: { S1: 'A503' } }, D4: { TUE: { S1: 'A508' } }, D5: { SAT: { S1: 'K101' } }, D6: { SAT: { S1: 'K102' } }, D7: { SAT: { S1: 'K107' } } },
  'CSE 303': { D1: { TUE: { S5: 'A603' } }, D2: { SAT: { S5: 'A606' } }, D3: { SAT: { S4: 'A602' }, TUE: { S2: 'J101' } }, D4: { SAT: { S4: 'A603' }, TUE: { S2: 'J107' } } },
  'CSE 304': { D1: { WED: { S5: 'J103' }, SAT: { S3: 'J103' } }, D2: { SAT: { S2: 'K101' } }, D3: { SAT: { S2: 'K102' } }, D4: { WED: { S1: 'J103' } }, D5: { SUN: { S3: 'A501' } }, D6: { SUN: { S3: 'A502' } }, D7: { SUN: { S3: 'A503' } } },
  'EEE 201': { D1: { SAT: { S2: 'J110' }, WED: { S1: 'J109' } }, D2: { SAT: { S1: 'K103' }, WED: { S2: 'J110' } }, D3: { SUN: { S4: 'K105' }, TUE: { S1: 'J101' } }, D4: { SUN: { S4: 'K106' }, TUE: { S1: 'J107' } } },
  'EEE 202': { D1: { WED: { S1: 'G107' } }, D2: { WED: { S1: 'A607' } }, D3: { SUN: { S1: 'G107' }, WED: { S3: 'G107' } }, D4: { SUN: { S1: 'A607' }, WED: { S3: 'A607' } }, D5: { SUN: { S1: 'G107' } }, D6: { SUN: { S2: 'A607' } } },
  'CSE 313': { D1: { SAT: { S5: 'K103' }, TUE: { S5: 'A606' } }, D2: { SAT: { S5: 'K108' }, TUE: { S5: 'K103' } }, D3: { SAT: { S5: 'K112' }, TUE: { S5: 'K103' } } },
  'GED 301': { D1: { SAT: { S1: 'A603' }, MON: { S4: 'A605' } }, D2: { SAT: { S1: 'A602' }, MON: { S4: 'A606' } } },
  'CSE 315': { D1: { SAT: { S2: 'A602' }, SUN: { S4: 'A602' }, TUE: { S1: 'A605' } }, D2: { SUN: { S4: 'K108' }, TUE: { S1: 'K108' } }, D3: { SUN: { S5: 'J107' }, TUE: { S1: 'K106' } } },
  'CSE 316': { D1: { MON: { S4: 'A503' }, SUN: { S3: 'J103' } }, D2: { MON: { S4: 'A508' }, SUN: { S3: 'J103' } }, D3: { SUN: { S1: 'J103' } }, D4: { SUN: { S2: 'A508' } } },
  'CSE 317': { D1: { SAT: { S2: 'A603' }, SUN: { S1: 'A502' }, TUE: { S2: 'A605' } }, D2: { SAT: { S2: 'A602' }, SUN: { S1: 'A501' }, TUE: { S2: 'A602' } }, D3: { SAT: { S2: 'K112' }, TUE: { S2: 'K106' } } },
  'CSE 318': { D1: { SUN: { S1: 'A502' }, MON: { S1: 'A502' } }, D2: { SUN: { S1: 'A501' }, MON: { S1: 'A501' } }, D3: { MON: { S1: 'A502' }, SUN: { S3: 'A502' } }, D4: { MON: { S1: 'A501' }, SUN: { S4: 'A508' } } },
  'CSE 311': { D1: { SUN: { S3: 'K106' }, TUE: { S1: 'L102' } }, D2: { SUN: { S3: 'K105' }, TUE: { S1: 'K105' } }, D3: { SUN: { S5: 'J105' }, TUE: { S3: 'K112' } } },
  'CSE 309': { D4: { SUN: { S5: 'J106' }, TUE: { S3: 'L102' } } },
  'CSE 312': { D1: { MON: { S3: 'A501' }, WED: { S3: 'A501' } }, D2: { MON: { S3: 'A502' }, WED: { S3: 'A502' } }, D3: { MON: { S3: 'A503' }, WED: { S3: 'A502' } }, D4: { WED: { S4: 'A502' } } },
  'CSE 310': { D1: { WED: { S5: 'K102' } }, D2: { WED: { S5: 'A508' } } },
  'ESP 401': { D1: { SUN: { S1: 'A605' }, MON: { S4: 'J101' }, TUE: { S3: 'J101' } }, D2: { SUN: { S1: 'K105' }, MON: { S4: 'J105' }, TUE: { S3: 'J105' } }, D3: { SUN: { S3: 'K112' }, MON: { S3: 'K103' }, WED: { S3: 'K103' } }, D4: { SUN: { S3: 'L102' }, WED: { S3: 'A602' } } },
  'CSE 403': { D1: { SUN: { S2: 'A605' }, TUE: { S2: 'L102' } }, D2: { SUN: { S2: 'K105' }, TUE: { S2: 'K105' } }, D3: { SUN: { S5: 'J105' }, TUE: { S4: 'J101' } }, D4: { SUN: { S5: 'J106' }, TUE: { S4: 'J107' } }, D5: { SUN: { S1: 'J101' } } },
  'CSE 404': { D1: { SUN: { S4: 'A501' } }, D2: { SUN: { S4: 'A502' } }, D3: { SUN: { S5: 'L106' } }, D4: { MON: { S1: 'L106' } }, D5: { SUN: { S1: 'A503' } }, D6: { SUN: { S1: 'K101' } }, D7: { SUN: { S1: 'K102' } } },
  'CSE 320': { D1: { TUE: { S4: 'A501' } }, D2: { TUE: { S4: 'A502' } }, D3: { TUE: { S4: 'A503' } }, D4: { TUE: { S1: 'J103' } }, D5: { TUE: { S1: 'J108' } }, D6: { TUE: { S1: 'K102' } } },
  'CSE 323': { D1: { MON: { S1: 'A602' }, WED: { S1: 'A605' } }, D2: { MON: { S1: 'A603' }, WED: { S1: 'A606' } } },
  'CSE 413': { D1: { MON: { S2: 'A602' }, WED: { S2: 'A605' } } },
  'CSE 425': { D1: { MON: { S2: 'A603' }, WED: { S2: 'A606' } } },
  'CSE 414': { D1: { WED: { S4: 'K101' } }, D2: { WED: { S4: 'K102' } } },
  'CSE 426': { D1: { WED: { S4: 'L104' } } },
  'GED 407': { D1: { MON: { S5: 'J101' }, TUE: { S1: 'K105' } }, D2: { MON: { S5: 'J105' }, TUE: { S1: 'K106' } }, D3: { MON: { S5: 'J106' }, TUE: { S1: 'K108' } } },
  'GED 403': { D1: { MON: { S4: 'A602' }, TUE: { S2: 'K105' } }, D2: { MON: { S4: 'A603' }, TUE: { S2: 'K106' } }, D3: { MON: { S4: 'K105' }, TUE: { S2: 'K108' } } },
  'CSE 435': { D1: { SAT: { S1: 'K105' } }, D2: { SAT: { S1: 'J110' } } },
  'CSE 453': { D1: { SAT: { S1: 'K106' } } },
  'CSE 436': { D1: { SAT: { S4: 'K101' } }, D2: { SAT: { S4: 'K102' } }, D3: { SAT: { S1: 'J103' } }, D4: { SAT: { S1: 'J108' } } },
  'CSE 454': { D1: { SAT: { S4: 'L106' } }, D2: { SAT: { S4: 'K109' } } },
  'PSD 400': { D1: { SAT: { S3: 'K105' } }, D2: { SAT: { S3: 'K106' } }, D3: { SAT: { S3: 'J101' } } }
};

// Helper slot extraction
function getSlots(code, sec) {
  const s = SCH[code];
  if (!s || !s[sec]) return [];
  const r = [];
  for (const d of DAYS) {
    if (s[sec][d]) {
      for (const [sl, room] of Object.entries(s[sec][d])) {
        r.push({ day: d, slot: sl, room });
      }
    }
  }
  return r;
}

export default function App() {
  const [selectedBatch, setSelectedBatch] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selected, setSelected] = useState({});
  const [courseColors, setCourseColors] = useState({});

  const batches = useMemo(() => Object.keys(COURSES).sort((a, b) => b - a), []);

  const coursesList = useMemo(() => {
    if (!selectedBatch) return [];
    let list = COURSES[selectedBatch] || [];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(c => `${c.code} ${c.name}`.toLowerCase().includes(q));
    }
    return list;
  }, [selectedBatch, searchQuery]);

  const totalCredits = useMemo(() => {
    let t = 0;
    for (const k of Object.keys(selected)) {
      const [code, batch] = k.split('||');
      const c = COURSES[batch]?.find(x => x.code === code);
      if (c) t += c.credit;
    }
    return t;
  }, [selected]);

  const selectedEntries = useMemo(() => Object.entries(selected), [selected]);

  const currentOccupied = useMemo(() => {
    const o = {};
    for (const [k, sec] of Object.entries(selected)) {
      const [code] = k.split('||');
      for (const s of getSlots(code, sec)) {
        o[`${s.day}:${s.slot}`] = true;
      }
    }
    return o;
  }, [selected]);

  const handleSectionToggle = (code, batch, sec) => {
    const k = `${code}||${batch}`;
    if (selected[k] === sec) {
      const newSel = { ...selected };
      const newCol = { ...courseColors };
      delete newSel[k];
      delete newCol[k];
      setSelected(newSel);
      setCourseColors(newCol);
      return;
    }

    const occupied = {};
    for (const [key, val] of Object.entries(selected)) {
      if (key === k) continue;
      const [c] = key.split('||');
      for (const s of getSlots(c, val)) occupied[`${s.day}:${s.slot}`] = true;
    }

    const slotsToAdd = getSlots(code, sec);
    if (slotsToAdd.some(s => occupied[`${s.day}:${s.slot}`])) return;

    const newSel = { ...selected, [k]: sec };
    const newCol = { ...courseColors };
    if (!newCol[k]) newCol[k] = COLORS[Object.keys(newCol).length % COLORS.length];
    setSelected(newSel);
    setCourseColors(newCol);
  };

  const removeCourse = (k) => {
    const newSel = { ...selected };
    const newCol = { ...courseColors };
    delete newSel[k];
    delete newCol[k];
    setSelected(newSel);
    setCourseColors(newCol);
  };

  const getItemsForSlot = (day, slotKey) => {
    const items = [];
    for (const [k, sec] of Object.entries(selected)) {
      const [code] = k.split('||');
      const slots = getSlots(code, sec);
      const match = slots.find(s => s.day === day && s.slot === slotKey);
      if (match) {
        const [bg, fg] = (courseColors[k] || COLORS[0]).split(':');
        items.push({ key: k, code, sec, room: match.room, bg, fg });
      }
    }
    return items;
  };

  const selectedCount = selectedEntries.length;
  const occupiedCount = Object.keys(currentOccupied).length;

  return (
    <div className="app-shell">
      <div className="ambient-glow ambient-glow--one" />
      <div className="ambient-glow ambient-glow--two" />

      <div className="app-frame">
        <header className="app-header">
          <div className="brand">
            <div className="brand__mark">
              <Calendar className="w-7 h-7 text-white" />
            </div>
            <div className="brand__text">
              <div className="brand__kicker">Course planner</div>
              <h1 className="brand__title">Shut Up and Take Course</h1>
              <div className="brand__subtitle">CSE · Summer 2026 · GUB</div>
            </div>
          </div>

          <div className="header-meta">
            <div className="meta-pill">{batches.length} batches</div>
            <div className="meta-pill">{selectedCount} selected</div>
            <div className="meta-pill">{occupiedCount} occupied slots</div>
          </div>
        </header>



        <main className="workspace">
          <aside className="panel panel--controls">
            <div className="panel__header">
              <div className="panel__header-row">
                <h2 className="panel__title">
                  <Layers className="w-4 h-4" /> Catalog
                </h2>
                <div className="credit-badge">{totalCredits.toFixed(1)} Credits</div>
              </div>

              <div className="field-stack">
                <select
                  className="field-select"
                  value={selectedBatch}
                  onChange={(e) => {
                    setSelectedBatch(e.target.value);
                    setSearchQuery('');
                  }}
                >
                  <option value="">Select your batch</option>
                  {batches.map((b) => (
                    <option key={b} value={b}>
                      Batch {b}
                    </option>
                  ))}
                </select>

                <div className="field-wrap">
                  <Search className="field-icon w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search by code or title"
                    className="field"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    disabled={!selectedBatch}
                  />
                </div>
              </div>
            </div>

            <div className="panel__body">
              <div className="course-list">
                {!selectedBatch ? (
                  <div className="empty-state">
                    <GraduationCap className="empty-state__icon" />
                    <div>
                      <div className="empty-state__title">Choose a batch</div>
                      <div className="empty-state__text">Select a batch above to load available courses.</div>
                    </div>
                  </div>
                ) : coursesList.length === 0 ? (
                  <div className="search-empty">No matches found.</div>
                ) : (
                  coursesList.map((c) => {
                    const k = `${c.code}||${selectedBatch}`;
                    const isSel = !!selected[k];
                    const [bg, fg] = isSel ? (courseColors[k] || COLORS[0]).split(':') : [];

                    return (
                      <article
                        key={c.code}
                        className={`course-card ${isSel ? 'course-card--selected' : ''}`}
                        style={isSel ? { backgroundColor: bg, borderColor: `${fg}40` } : {}}
                      >
                        <div className="course-card__top">
                          <span
                            className={`course-card__code ${isSel ? 'course-card__code--selected' : ''}`}
                            style={isSel ? { color: fg, borderColor: `${fg}20` } : {}}
                          >
                            {c.code}
                          </span>
                          <span className="course-card__credits">{c.credit} Cr</span>
                        </div>

                        <div
                          className={`course-card__title ${isSel ? 'course-card__title--selected' : ''}`}
                          style={isSel ? { color: fg } : {}}
                        >
                          {c.name}
                        </div>

                        <div className="section-row">
                          {c.sections.map((sec) => {
                            const active = selected[k] === sec;
                            const slots = getSlots(c.code, sec);
                            const conflict = !active && slots.some((s) => currentOccupied[`${s.day}:${s.slot}`]);

                            return (
                              <button
                                key={sec}
                                onClick={() => handleSectionToggle(c.code, selectedBatch, sec)}
                                disabled={conflict}
                                className={`section-chip ${active ? 'section-chip--active' : ''} ${conflict ? 'section-chip--blocked' : ''}`}
                                style={active ? { backgroundColor: fg, borderColor: fg } : {}}
                              >
                                {sec}
                              </button>
                            );
                          })}
                        </div>
                      </article>
                    );
                  })
                )}
              </div>
            </div>
          </aside>

          <section className="schedule-panel">
            <div className="enrollment-card">
              <div className="enrollment-card__header">
                <h3 className="section-kicker">My enrollment</h3>
              </div>
              <div className="enrollment-card__body">
                <div className="chip-cloud">
                  {selectedCount === 0 ? (
                    <div className="enrollment-empty">
                      <BookOpen className="w-5 h-5" />
                      Waiting for courses...
                    </div>
                  ) : (
                    selectedEntries.map(([k, sec]) => {
                      const [code] = k.split('||');
                      const [bg, fg] = (courseColors[k] || COLORS[0]).split(':');

                      return (
                        <div key={k} className="enrollment-chip" style={{ backgroundColor: bg, color: fg }}>
                          <span>{code} — {sec}</span>
                          <button onClick={() => removeCourse(k)} className="enrollment-chip__button" aria-label={`Remove ${code} ${sec}`}>
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            <div className="schedule-card">
              <div className="schedule-card__header">
                <h3 className="section-kicker">Weekly timetable</h3>
              </div>
              <div className="schedule-scroll">
                <table className="schedule-table">
                  <thead>
                    <tr>
                      <th>Slot</th>
                      {DAYS.map((d) => (
                        <th key={d}>{d}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {SLOTS.map((sl) => {
                      if (sl.key === 'BR') {
                        return (
                          <tr key={sl.key} className="schedule-break">
                            <td className="schedule-slot">BREAK</td>
                            {DAYS.map((d) => (
                              <td key={d} />
                            ))}
                          </tr>
                        );
                      }

                      return (
                        <tr key={sl.key}>
                          <td className="schedule-slot">
                            {sl.label.split(' - ').map((t, i) => (
                              <div key={i} className="schedule-slot__line">
                                {t}
                              </div>
                            ))}
                          </td>
                          {DAYS.map((d) => {
                            const items = getItemsForSlot(d, sl.key);

                            return (
                              <td key={d} className="schedule-cell">
                                {items.map((it) => (
                                  <div
                                    key={it.key}
                                    className="schedule-card-item"
                                    style={{ backgroundColor: it.bg, color: it.fg, borderColor: `${it.fg}20` }}
                                  >
                                    <div className="schedule-card-item__top">
                                      <span className="schedule-card-item__code">{it.code}</span>
                                      <span className="schedule-card-item__section">{it.sec}</span>
                                    </div>
                                    <div className="schedule-card-item__room" style={{ borderColor: `${it.fg}10` }}>
                                      <ShieldCheck className="w-3.5 h-3.5" /> RM: {it.room}
                                    </div>
                                  </div>
                                ))}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </main>

        <footer className="footer-card">
          <div className="profile-wrap">
            <img
              className="profile-avatar"
              src={developerImage}
              alt="Abdullah Al Fahim"
              onError={(e) => {
                e.target.src = 'https://ui-avatars.com/api/?name=Abdullah+Al+Fahim&background=1a3a6b&color=fff&size=200';
              }}
            />
            <div className="profile-badge">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>

          <div className="profile-body">
            <h4 className="profile-name">Abdullah Al Fahim</h4>
            <div className="profile-meta">
              <span>Blue Team Secretary</span>
              <span>GUCC Cyber Security Society</span>
            </div>
            <div className="profile-links">
              <a
                href="https://github.com/abdullah-alfahim"
                target="_blank"
                rel="noopener noreferrer"
                className="profile-link"
              >
                <Code2 className="w-5 h-5" />
                GitHub Repository
                <ExternalLink className="w-3.5 h-3.5 opacity-60" />
              </a>
            </div>
          </div>

          <div className="footer-note">
            <div className="footer-note__label">Engineered with precision</div>
            <div className="footer-note__body">
              Department of CSE
              <br />
              Green University of Bangladesh
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
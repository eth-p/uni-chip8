gantt
dateFormat MM-DD-YYYY
section Release
Release 0: active, R0, 01-04-2019, 01-18-2019
Release 1: R1, after R0, 02-06-2019
Release 2: R2, after R1, 02-27-2019
Release 3: R3, 02-28-2019, 03-13-2019
Release 4: R4, after R3, 04-08-2019

section Modules
Documentation: active, 01-04-2019, 04-08-2019
Tools: active, T, 01-04-2019, 02-06-2019
Virtual Machine: active, VM, after R0, 02-27-2019
Webpage: W, after R0, 03-13-2019
Programs: P, 02-15-2019, 04-08-2019

section Module - Tools
Simple Contribution Tool: done, SCT, 01-04-2019, 01-12-2019
Automated Testing: TEST
Build System: active, BUILD, 01-12-2019, 01-18-2019

section Module - VM
opcodes: after R0, 02-05-2019
vm architecture: after R0, 01-24-2019

section Webpage

section Programs



<!-- https://mermaidjs.github.io/mermaid-live-editor/
Paste in the code above -->
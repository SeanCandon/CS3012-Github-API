from github import Github
from firebase import firebase
import json
import sys
firebase = firebase.FirebaseApplication('https://github-api-5f6b3.firebaseio.com', None)

lines = [line.rstrip('\n') for line in open('cred.txt')]

g = Github(lines[0])
u = g.get_user(sys.argv[1])
username = sys.argv[1]
print(username)
#upd = sys.argv[2]

#result = firebase.delete('/followers', '')
'''
result = firebase.get('/'+username, None)
if result is None:
    upd = True

if upd is True:
'''
sunday = 0
monday = 0
tuesday = 0
wednesday = 0
thursday = 0
friday = 0
saturday = 0

for r in u.get_repos():
    ca = r.get_stats_commit_activity()
    c = len(ca)
    i = 1
    for c1 in ca:
        days = c1.days
        sunday += days[0]
        monday += days[1]
        tuesday += days[2]
        wednesday += days[3]
        thursday += days[4]
        friday += days[5]
        saturday += days[6]

data = {'sunday': sunday, 'monday': monday, 'tuesday': tuesday, 'wednesday': wednesday,
        'thursday': thursday, 'friday': friday, 'saturday': saturday}
report = firebase.put('', '/'+username, data)

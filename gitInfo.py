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

data = {'username': username}
report = firebase.put('', '/'+username, data)

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
report = firebase.put('', '/'+username+'/user', data)

sunday = 0
monday = 0
tuesday = 0
wednesday = 0
thursday = 0
friday = 0
saturday = 0
noFoll = 0

for f in u.get_followers():
    for r in f.get_repos():
        ca = r.get_stats_commit_activity()
        if ca != None:
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
    noFoll += 1

data = {'sunday': sunday/noFoll, 'monday': monday/noFoll, 'tuesday': tuesday/noFoll,
        'wednesday': wednesday/noFoll,'thursday': thursday/noFoll,
        'friday': friday/noFoll,'saturday': saturday/noFoll}
report = firebase.put('', '/'+username+'/followers', data)

from github import Github
from firebase import firebase
import json
import sys
firebase = firebase.FirebaseApplication('https://github-api-5f6b3.firebaseio.com', None)

lines = [line.rstrip('\n') for line in open('cred.txt')]

g = Github(lines[0])

u = g.get_user(sys.argv[1])
print(u.login)
i=0
s = 0
commits = 0

#result = firebase.delete('/followers', '')

for r in u.get_repos():
    s = s + r.size
    i = i+1
    canGet = False
    if r.get_stats_contributors() is not None:
        canGet = True
    if canGet is True:
        for c in r.get_stats_contributors():
            if(c.author.login == u.login):
                commits += c.total
sizeU = s/i
commU = commits/i
#data = {'user': s}
#result = firebase.put('', '/'+u.login+'/size', data)
#data = {'user': commits}
#result = firebase.put('', '/'+u.login+'/commits', data)

followers = u.get_followers()

sizeL = []
commL = []

for f in followers:
    i=0
    s = 0
    commits = 0
    canGet = False
    for r in f.get_repos():
        s = s + r.size
        i = i+1
        if r.get_stats_contributors() is not None:
            canGet = True
            for c in r.get_stats_contributors():
                if(c.author.login == f.login):
                    commits += c.total
    if canGet is True:
        s = s/i
        commits = commits/i
        sizeL.append(s)
        commL.append(commits)

sizeT = 0
commT = 0
i = 0
for s in sizeL:
    sizeT += s
    i += 1

sizeA = sizeT/i

i=0
for c in commL:
    commT += c
    i += 1

commA = commT/i

data = {'user': sizeU, 'followers': sizeA}
result = firebase.put('', '/'+u.login+'/size', data)
data = {'user': commU, 'followers': commA}
result = firebase.put('', '/'+u.login+'/commits', data)

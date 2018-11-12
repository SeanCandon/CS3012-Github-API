from github import Github
from firebase import firebase
import json
import sys

firebase = firebase.FirebaseApplication('https://github-api-5f6b3.firebaseio.com', None)

g = Github("ac6ad31084ea294f6e287cf860e5fb3c06136cbf")

u = g.get_user(sys.argv[1])
print(u.name)

followers = u.get_followers()

for f in followers:
    name = f.name
    path = '/users/' + name
    #print(f.name + "'s %s" % "shite")
    for r in f.get_repos():
        rn = r.name
        
        #f.write(r.get_languages());
    #    f = open("file.txt", "a")
    #    f.write(str(r.name) + "\n")
        #print(type(r.name))
        #print(r.name)
#        print(r.name)
    #    print(r.get_languages())
    #    print("     " + r.name)
    #print(f);
#    print("---------------------------------------")

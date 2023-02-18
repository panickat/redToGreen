import re
import os

def buscar_archivos(dirList, term):
    r = ""
    for dir in dirList:
        for raiz, directorios, archivos in os.walk(dir):
            for archivo in archivos:
                if term in archivo:
                    #print(os.path.join(raiz, archivo))
                    try:
                        date = re.search("\_\d{8}\_",archivo).group(0)[1:-1] # date 8 digits to 6
                        hour = re.search("\_\d{4}\_",archivo).group(0)[1:-1] # 4 digit hour
                    except:
                        pass
                    else:
                        short_date = date[0:4] + date[6:]
                        r += short_date + " " + hour + " "
    return r
dirToSearch = ("/Users/panic/Downloads/.jb.noindex/kimmysantos","/Users/panic/Downloads/.jb.noindex/kika","/Users/panic/camvideos")

term = input("Buscar: ")

print(buscar_archivos(dirToSearch,term))

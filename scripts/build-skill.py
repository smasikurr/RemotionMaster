import os
import zipfile
import time
import shutil

def build_skill():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    src_dir = os.path.join(base_dir, ".agents", "skills", "remotion-master")
    
    # Destination 1: In the repo root
    repo_dest = os.path.join(base_dir, "remotion-master.skill")
    # Destination 2: In workspace root
    workspace_dest = os.path.abspath(os.path.join(base_dir, "..", "..", "..", "remotion-master.skill"))

    files_to_pack = [
        ("SKILL.md", os.path.join(src_dir, "SKILL.md")),
        ("assets/theme.ts", os.path.join(src_dir, "assets", "theme.ts")),
        ("references/design-rules.md", os.path.join(src_dir, "references", "design-rules.md")),
        ("references/motion-patterns.md", os.path.join(src_dir, "references", "motion-patterns.md")),
    ]

    dirs_to_pack = [
        "remotion-master/",
        "remotion-master/assets/",
        "remotion-master/references/",
    ]

    now = time.localtime(time.time())[:6]

    for dest in [repo_dest, workspace_dest]:
        with zipfile.ZipFile(dest, "w", compression=zipfile.ZIP_DEFLATED) as z:
            for d in dirs_to_pack:
                zinfo = zipfile.ZipInfo(d, now)
                zinfo.create_system = 3  # Unix
                zinfo.external_attr = 0o40755 << 16  # directory permissions rwxr-xr-x
                z.writestr(zinfo, b"")
            
            for rel_path, abs_path in files_to_pack:
                arcname = f"remotion-master/{rel_path}".replace("\\", "/")
                with open(abs_path, "rb") as f:
                    content = f.read()
                zinfo = zipfile.ZipInfo(arcname, now)
                zinfo.create_system = 3  # Unix
                zinfo.external_attr = 0o100644 << 16  # file permissions rw-r--r--
                z.writestr(zinfo, content)
        
        print(f"Created: {dest}")

if __name__ == "__main__":
    build_skill()

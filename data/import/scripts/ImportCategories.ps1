# CATEGORIES
# Categories import (depends on previously imported topics)

$dataFilePath = "c:\projects\Sitecore.Link\data\import\files\cats.xml"
$topicsRootPath = "/sitecore/content/Data/Categories"

# Ensure topics already exist
if(-Not(Test-Path -Path $topicsRootPath) -or (Get-ChildItem -Path $topicsRootPath).Count -eq 0)
{
    Write-Host Error: Please import the topics first.
    return
}

$topicsRoot = Get-Item -Path "/sitecore/content/Data/Categories"

$f = [System.Xml.XmlReader]::create($dataFilePath)
while ($f.read())
{
    switch ($f.NodeType)
    {
        ([System.Xml.XmlNodeType]::Element)
        {
            if ($f.Name -eq "Category")
            {
                $e = [System.Xml.Linq.XElement]::ReadFrom($f)
                if ($e -ne $null)
                {
                    $name = ([Sitecore.Data.Items.ItemUtil]::ProposeValidItemName($e.value))
                    $title = [string] $e.value
                    $categoryid = [string] $e.Attribute("id").value
                    $tops = [string] $e.Attribute("tops").value
                    
                    $criteria = @(
                                @{ Filter = "Equals"; Field = "categoryid"; Value = $tops },
                                @{ Filter = "Equals"; Field = "_templatename"; Value = "Topic" },
                                @{ Filter = "DescendantOf"; Value = $topicsRoot }
                            )
                    $props = @{
                        Index = "sitecore_master_index"
                        Criteria = $criteria
                    }
                    
                    $topic = Find-Item @props -First 1 | Select-Object -Expand "Fields"
                    $topicPath = [string]($topic["_fullpath"])
                    $newItem = New-Item -Path $topicPath -Name $name -ItemType "{41FC2039-8529-427E-832C-DE4F81E0DEB4}"
                    
                    $newItem.Editing.BeginEdit()
                    $newItem["title"] = $title
                    $newItem["categoryid"] = $categoryid
                    # Assigning result just not to print to output
                    $r = $newItem.Editing.EndEdit()
                    
                    Write-Host Imported $e.value
                }
            }
            break
        }
    }
}
Write-Host `n
Write-Host Done.

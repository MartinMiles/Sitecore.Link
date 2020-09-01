# TOPICS
# Clean topics import (wipes out existing topics with their child categories)

$dataFilePath = "c:\projects\Sitecore.Link\data\import\files\tops.xml"
$dataRootPath = "/sitecore/content/Data"
$topicsRootPath = $dataRootPath + "/Categories"

# Ensure root item for data exists
if(-Not(Test-Path -Path $dataRootPath))
{
    Write-Host Root item for data doesn`'t exist`, creating one...
    New-Item -Path $dataRootPath -ItemType "Common/Folder"
    Write-Host `n
}

# Ensure parent item for topics exists
if(-Not(Test-Path -Path $topicsRootPath))
{
    Write-Host Topics parent item doesn`'t exist`, creating one...
    New-Item -Path $topicsRootPath -ItemType "Common/Folder"
    Write-Host `n
}

# Remove existing topics (with their child categories)
New-UsingBlock (New-Object Sitecore.Data.BulkUpdateContext) {
    Write-Host Removing existing topics...
    Get-ChildItem -Path $topicsRootPath | Remove-Item -Recurse -Permanently
    Write-Host `n
}

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
                    
                    $newItem = New-Item -Path $topicsRootPath -Name $name -ItemType "{44818472-8FE9-4FC5-BD21-A2C140A49A9E}"
                    
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
